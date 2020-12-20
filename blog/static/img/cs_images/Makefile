GOBIN ?= $$PWD/bin

define build
    mkdir -p $(GOBIN)
    GOGC=off GOBIN=$(GOBIN) \
		go install -v \
		-mod=vendor \
		-gcflags='-e' \
		$(1)
endef

define test-lib
	GOGC=off go test $(TEST_FLAGS) $$(go list ./... | grep -v -e /vendor/ -e /cmd/) | grep -v '\[no test files\]'
endef

local-images-reset:
	@export VERSION=latest && export REGISTRY=localhost:5000 && $(MAKE) build-images && $(MAKE) push-images

stg-images-reset:
	@export VERSION=stg && export REGISTRY=gcr.io/valued-sight-253418 && $(MAKE) build-images && $(MAKE) push-images

local-context:
	@kubectl config use-context kind-kind || true
	@vx config --url=http://localhost:8080
	@blobheart config --url=http://localhost:8070

stg-context:
	@kubectl config use-context gke_valued-sight-253418_us-central1-a_vx-stg || true
	@vx config --url=http://stg.operator.cohere.ai
	@blobheart config --url=https://stg.api.blobheart.cohere.ai


prod-context:
	@kubectl config use-context gke_valued-sight-253418_us-central1-a_vx || true
	@vx config --url=https://operator.cohere.ai
	@blobheart config --url=https://api.blobheart.cohere.ai

run-backend:
	@ulimit -n 4096 && GOBIN=$(GOBIN) reflex --decoration=none --config=reflex-backend-conf

run-aurthur:
	@ulimit -n 4096 && reflex --decoration=none -sr 'services/aurthur/|config/aurthur/|data/|proto/|lib/' -R 'vendor/|web/' -- sh -c 'make build-aurthur && ${GOBIN}/aurthur start'

run-shrimp:
	@reflex --decoration=none -sr 'services/shrimp/|config/shrimp/|data/|proto/|lib/' -R 'vendor/|web/' -- sh -c 'make build-shrimp && ${GOBIN}/shrimp start'

run-bzz-no-models:
	@ulimit -n 4096 && reflex --decoration=none -sr 'services/bzz/|config/bzz/|data/|proto/|lib/' -R 'vendor/|web/' -- sh -c 'make build-bzz && ${GOBIN}/bzz start --name=test-bzz-api --port=8887 --encoder_dir=gs://cohere-prod/encoders/random_encoder'

npm-install:
	@cd web && npm install

test-lib:
	$(call test-lib)

build-backend:
	@$(call build, ./cmd/backend)

build-bzz:
	@$(call build, ./cmd/bzz)

build-aurthur:
	@$(call build, ./cmd/aurthur)

build-onboard:
	$(call build, ./cmd/onboard)

build-blobheart:
	@$(call build, ./cmd/blobheart)

build-shrimp:
	@$(call build, ./cmd/shrimp)

build-cmd:
	$(call build, ./cmd/blobheart)
	$(call build, ./cmd/backend)
	$(call build, ./cmd/bzz)
	$(call build, ./cmd/aurthur)
	$(call build, ./cmd/onboard)
	$(call build, ./cmd/shrimp)

VERSION ?= latest
REGISTRY ?= localhost:5000

push-images:
	@docker push $(REGISTRY)/blobheart-backend:$(VERSION)
	@docker push $(REGISTRY)/bzz:$(VERSION)
	@docker push $(REGISTRY)/aurthur:$(VERSION)
	@docker push $(REGISTRY)/shrimp:$(VERSION)

build-images:
	@docker build -f images/backend/Dockerfile -t $(REGISTRY)/blobheart-backend:$(VERSION) .
	@docker build -f images/bzz/Dockerfile -t $(REGISTRY)/bzz:$(VERSION) .
	@docker build -f images/aurthur/Dockerfile -t $(REGISTRY)/aurthur:$(VERSION) .
	@docker build -f images/shrimp/Dockerfile -t $(REGISTRY)/shrimp:$(VERSION) .

tag-latest:
	@docker tag $(REGISTRY)/blobheart-backend:$(VERSION) $(REGISTRY)/blobheart-backend:latest
	@docker tag $(REGISTRY)/bzz:$(VERSION) $(REGISTRY)/bzz:latest
	@docker tag $(REGISTRY)/aurthur:$(VERSION) $(REGISTRY)/aurthur:latest
	@docker tag $(REGISTRY)/shrimp:$(VERSION) $(REGISTRY)/shrimp:latest

tools:
	@mkdir -p bin/
	@cd $(GOBIN) && go get -u -v github.com/golang/protobuf/proto
	@cd $(GOBIN) && go get -u -v github.com/golang/protobuf/protoc-gen-go
	@cd $(GOBIN) && go get -u -v golang.org/x/tools/cmd/goimports
	@cd $(GOBIN) && go get -u -v github.com/cespare/reflex
	@cd $(GOBIN) && rm -rf $(GOPATH)/src/github.com/webrpc/webrpc && git clone https://github.com/cohere-ai/webrpc.git $(GOPATH)/src/github.com/webrpc/webrpc
	@cd $(GOPATH)/src/github.com/webrpc/webrpc && make build && go install ./cmd/webrpc-gen
	@go mod vendor
	@go mod tidy

bootstrap:
	@$(MAKE) tools
	@$(MAKE) db-reset
	@$(MAKE) db-up
	@$(MAKE) npm-install
	@$(MAKE) build-onboard
	@$(GOBIN)/onboard --init --admin_pw=blahblah

generate: generate-server generate-web

generate-server:
	@webrpc-gen -schema=blobheart.ridl -target=go -pkg=proto -server -client -out=./proto/blobheart.gen.go

generate-web:
	@webrpc-gen -schema=blobheart.ridl -target=ts -client -out=./web/src/utils/blobheart.gen.ts

# Recreate the database and run it.
db-reset:
	@docker-compose up -d --build --force-recreate
	@echo "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = 'blobheartdb' AND pid <> pg_backend_pid(); DROP DATABASE IF EXISTS blobheartdb;" | ./scripts/psql -U postgres -v ON_ERROR_STOP=1
	@scripts/db.sh create blobheartdb

db-update-schema:
	@./scripts/pg_dump blobheartdb --schema-only | grep -v -e '^--' -e '^COMMENT ON' -e '^REVOKE' -e '^GRANT' -e '^SET' -e 'ALTER DEFAULT PRIVILEGES' -e 'OWNER TO' | cat -s > ./data/schema/schema.sql

db-up: build-cmd
	@$(GOBIN)/backend migrate up
	@$(MAKE) db-update-schema

db-down:
	@$(GOBIN)/backend migrate down
	@$(MAKE) db-update-schema

onboard:
	@sh ./scripts/onboard.sh

large-file-check:
	@find . -not -iwholename '*/.git/*' -not -iwholename '*/.cache/*' -name '*' -size +2M -exec du -hs {} \; | grep '.*' && { echo; echo "Aborting due to big files in the git repository."; exit 1; } || :

goimports-check:
	@which goimports 2>/dev/null || go get -u golang.org/x/tools/cmd/goimports
	@goimports -d $(shell find . -type f -name '*.go' -not -path "./vendor/*") | grep '.*' && { echo; echo "Aborting due to non-empty goimports output."; exit 1; } || :

goimports:
	@goimports -w $(shell find . -type f -name '*.go' -not -path "./vendor/*")

ci-test: large-file-check goimports-check test-lib

check-go-mod:
	@./scripts/ci/check-go-mod.sh

deploy-stg:
	@NETLIFY_AUTH_TOKEN="$(shell gsutil cat gs://cohere-prod/secrets/blobheart-netlify)" CONFIG=staging sh scripts/deploy-env.sh

deploy-prod:
	@NETLIFY_AUTH_TOKEN="$(shell gsutil cat gs://cohere-prod/secrets/blobheart-netlify)" CONFIG=production sh scripts/deploy-env.sh
