+++
title = "Tensorflow with Go Code Examples: TFRecord Examples, TF Serving Clients"
date = 2021-03-06
weight = 4
+++

> All code examples can be found in [this repo](https://github.com/kipply/tf-go-examples). If you know what you're looking for, and the code works out of the box for you, the following post will be pretty useless. 

Tensorflow doesn't yet have support for TFRecords or TF Serving clients. This is not a package because TFRecord read/write and gRPC TFServing client are no more than a hundred lines each, and I don't want to maintain it. 

Reference Links: [gRPC](https://grpc.io/) || [Proto Buffers Go](https://developers.google.com/protocol-buffers/docs/gotutorial) || [Tensorflow Serving](https://www.tensorflow.org/tfx/serving/serving_basic) || [TFRecords and tf.Train.Example](https://www.tensorflow.org/tutorials/load_data/tfrecord) 

### Compiling Protos

To generate the Go files: 

- Clone the TF Serving and Tensorflow repositories
- Checkout to the version you need 
- Run [this script](https://github.com/kipply/tf-go-examples/blob/master/compile.sh) after replacing the `PATH_TO_TF` and `PATH_TO_TF_SERVING` variables with your path.

```bash
PATH_TO_TF=/Users/kipply/code/tensorflow/
PATH_TO_TF_SERVING=/Users/kipply/code/tfserving/

eval "protoc -I $PATH_TO_TF_SERVING -I $PATH_TO_TF --go_out=plugins=grpc:src/ $PATH_TO_TF_SERVING/tensorflow_serving/apis/*.proto"
eval "protoc -I $PATH_TO_TF_SERVING -I $PATH_TO_TF --go_out=plugins=grpc:src/ $PATH_TO_TF_SERVING/tensorflow_serving/config/*.proto"
eval "protoc -I $PATH_TO_TF_SERVING -I $PATH_TO_TF --go_out=plugins=grpc:src/ $PATH_TO_TF_SERVING/tensorflow_serving/util/*.proto"
eval "protoc -I $PATH_TO_TF_SERVING -I $PATH_TO_TF --go_out=plugins=grpc:src/ $PATH_TO_TF_SERVING/tensorflow_serving/core/*.proto"
eval "protoc -I $PATH_TO_TF_SERVING -I $PATH_TO_TF --go_out=plugins=grpc:src/ $PATH_TO_TF_SERVING/tensorflow_serving/sources/storage_path/*.proto"
eval "protoc -I $PATH_TO_TF_SERVING -I $PATH_TO_TF --go_out=plugins=grpc:src/ $PATH_TO_TF/tensorflow/core/framework/*.proto"
eval "protoc -I $PATH_TO_TF_SERVING -I $PATH_TO_TF --go_out=plugins=grpc:src/ $PATH_TO_TF/tensorflow/core/example/*.proto"
eval "protoc -I $PATH_TO_TF_SERVING -I $PATH_TO_TF --go_out=plugins=grpc:src/ $PATH_TO_TF/tensorflow/core/lib/core/*.proto"
eval "protoc -I $PATH_TO_TF_SERVING -I $PATH_TO_TF --go_out=plugins=grpc:src/ $PATH_TO_TF/tensorflow/core/protobuf/*.proto"
eval "protoc -I $PATH_TO_TF_SERVING -I $PATH_TO_TF --go_out=plugins=grpc:src/ $PATH_TO_TF/tensorflow/stream_executor/*.proto"

rm src/tensorflow_serving/apis/prediction_log.pb.go # causes an import loop
```

I also commited the compilation [here](https://github.com/kipply/tf-go-examples/tree/master/src), though I can't guarantee the version. I recommend that the compiled files be placed in the gopath, or the package name can be find+replaced and you can commit the `pb.go` files to your repository. 

The script compiles more packages than is absolutely necessary for TFServing+TFRecord writing. The import loop is that ``tensorflow_serving/prediction_log` imports `tensorflow_serving/core` which imports `tensorflow_serving/apis`. It's a logically valid import cycle of the structs and functions, but Golang won't allow package import cycles. If you need `prediction_log` protos, you can manually move `/core` into `/apis`.

### TF Serving Client over GRPC

A link to a executable script [here](https://github.com/kipply/tf-go-examples/blob/master/client.go). `cd` into the repository directory and execute with: 

```
export GOPATH=$GOPATH:$PWD && go run client.go
```

If no TF Serving Server is running at `localhost:9000`, then you'll get the following error; 

```
rpc error: code = Unavailable desc = connection error: desc = "transport: Error while dialing dial tcp [::1]:9000: connect: connection refused"
```

Here's a snippet of the script that fetches the model metadata, given the name of the model. In production, you should use a connection pool. 

```go
modelURL := "localhost:9000"
modelMetadataRequest := &tfServing.GetModelMetadataRequest{
  ModelSpec: &tfServing.ModelSpec{
    Name: "model",
  },
  MetadataField: []string{"signature_def"},
}

conn, err := grpc.Dial(modelURL, grpc.WithInsecure())
if err != nil {
  log.Fatalf(err.Error())
}

client := tfServing.NewPredictionServiceClient(conn)

metadata, err := client.GetModelMetadata(context.Background(), modelMetadataRequest)
if err != nil {
  log.Fatalf(err.Error())
}
fmt.Println(metadata)
```

A thing about gRPC over Go is that you always send slices. If you want to send a 2D slice of integers, you need to flatten the slice and specify the dimensions in the request, and gRPC will validate that a slice of the correct length was sent. [A link to the script again](https://github.com/kipply/tf-go-examples/blob/master/client.go#L48), and two functions to copypasta:

```go
func int64Flatten(slisli [][]int64) []int64 {
	flattened := []int64{}
	for _, sli := range slisli {
		flattened = append(flattened, sli...)
	}
	return flattened
}
func int32Flatten(slisli [][]int32) []int32 {
	flattened := []int32{}
	for _, sli := range slisli {
		flattened = append(flattened, sli...)
	}
	return flattened
}
```

### TFRecord Example Read+Write 

Link to executable script [here](https://github.com/kipply/tf-go-examples/blob/master/tfrecords.go). `cd` into the directory and execute with:

```bash
go run tfrecords.go
```

The output should be; 

```
[1 2 3 4 5] hello [0.1 0.2 0.3 0.4 0.5]
```

Here is the part of the script that's needed for read+write! 

```go
// https://github.com/tensorflow/tensorflow/blob/051a96f3ec4fc38b248e8ae8ad2f8ad124eda59b/tensorflow/core/lib/hash/crc32c.h
const maskDelta uint32 = 0xa282ead8

// https://github.com/tensorflow/tensorflow/blob/051a96f3ec4fc38b248e8ae8ad2f8ad124eda59b/tensorflow/core/lib/hash/crc32c.h#L53-L56
func mask(crc uint32) uint32 {
	return ((crc >> 15) | (crc << 17)) + maskDelta
}

var crc32Table = crc32.MakeTable(crc32.Castagnoli)

func crc32Hash(data []byte) uint32 {
	return crc32.Checksum(data, crc32Table)
}

func uint64ToBytes(x uint64) []byte {
	b := make([]byte, 8)
	binary.LittleEndian.PutUint64(b, x)
	return b
}

func Write(w io.Writer, data []byte) (int, error) {
	// Write based on format specified in https://github.com/tensorflow/tensorflow/blob/051a96f3ec4fc38b248e8ae8ad2f8ad124eda59b/tensorflow/core/lib/io/record_writer.cc#L124-L128
	//  uint64    length
	//  uint32    masked crc of length
	//  byte      data[length]
	//  uint32    masked crc of data

	length := uint64(len(data))
	lengthCRC := mask(crc32Hash(uint64ToBytes(uint64(len(data)))))
	dataCRC := mask(crc32Hash(data))

	if err := binary.Write(w, binary.LittleEndian, length); err != nil {
		return 0, err
	}

	if err := binary.Write(w, binary.LittleEndian, lengthCRC); err != nil {
		return 0, err
	}

	if _, err := w.Write(data); err != nil {
		return 0, err
	}

	if err := binary.Write(w, binary.LittleEndian, dataCRC); err != nil {
		return 0, err
	}

	return binary.Size(dataCRC) + len(data) + binary.Size(length) + binary.Size(lengthCRC), nil
}

func Read(r io.Reader) (data []byte, err error) {
	var (
		length         uint64
		lengthChecksum uint32
		dataChecksum   uint32
	)

	// get data length
	if err := binary.Read(r, binary.LittleEndian, &length); err != nil {
		return nil, err
	}

	// get length checksum
	if err := binary.Read(r, binary.LittleEndian, &lengthChecksum); err != nil {
		return nil, err
	}

	// get data
	data = make([]byte, length)
	if _, err := r.Read(data); err != nil {
		return nil, err
	}

	// get data checksum
	if err := binary.Read(r, binary.LittleEndian, &dataChecksum); err != nil {
		return nil, err
	}

	// check checksum length
	if actual := mask(crc32Hash(uint64ToBytes(length))); actual != lengthChecksum {
		return nil, errors.New("corrupted record, length checksum doesn't match")
	}

	// check data checksum
	if actual := mask(crc32Hash(data)); actual != dataChecksum {
		return nil, errors.New("corrupted record, data checksum doesn't match")
	}

	return data, nil
}
```

The code that writes tf.Train.Examples is [here](https://github.com/kipply/tf-go-examples/blob/master/tfrecords.go), and uses the Example proto compiled in the previous step. 

---

I'd like this to be good for Sea Eel Orbit, so in this post you have learned how to read and write Tensorflow Records in Golang and how to communicate with a Tensorflow Serving gRPC server with Golang. It also includes compiling Tensorflow and Tensorflow Serving protobufs. 

