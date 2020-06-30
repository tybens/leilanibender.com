// emcc -o hello2.html engcalc.cpp -O3 -s WASM=1  -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall','cwrap', 'UTF8ToString', 'getValue']"  -s ASSERTIONS=1 -s ALLOW_MEMORY_GROWTH=1

#include "bits/stdc++.h"
#include <emscripten/emscripten.h>
using namespace std;
#define vi vector<int>
#define pdv pair<long double, vi>
vector<vi> templates;
vector<vi> sequences;

long double constants[5] = {M_PI, M_E, (1.0 + sqrt(5)) / 2, 0.57721566490153, 0.007297352566417};
vector<pdv> pairs;

static vector<string> cst = {"\\pi ", "e", "\\varphi ", "\\gamma ", "\\alpha "};
// static vector<string> cst = {"pi ","e ","GoldenRatio ","EulerGamma ","300000000 "};
static vector<int> odr = {0, 0, 2, 1, 2, 2};

// 5:+, 6:-, 7:*, 8:/, 9:^, 10:!
// 0:+-, 1:/, 2:^*!, 3:num
string EMSCRIPTEN_KEEPALIVE latexfy(vector<int> v) {
	vector<string> ex(v.size()); // = new vector<string>();
	vector<int> exodr(v.size()); // = new vector<int>();
	string ep;
	int ind = 0;
	for (int i = 0; i < v.size(); i++) {
		// cout << "i = " << i << endl;
		if (v[i] < 5) {
			//cout << "Test" << endl;
			ex[ind] = cst[v[i]];
			exodr[ind] = 3;
			ind++;
		}

		if (v[i] >= 5 && v[i] < 10) {
			if (v[i] == 5)
				ep = ex[ind - 2] + " + " + ex[ind - 1];
			if (v[i] == 6) {
				if (exodr[ind - 1] == 0)
					ex[ind - 1] = "\\left (" + ex[ind - 1] + "\\right )";
				ep = ex[ind - 2] + " - " + ex[ind - 1];
			}
			if (v[i] == 7) {
				for (int k = 1; k < 3; k++)
					if (exodr[ind - k] < 2)
						ex[ind - k] = "\\left (" + ex[ind - k] + "\\right )";
				if (ex[ind - 2] == ex[ind - 1] && exodr[ind - 2] == 3)
					ep = ex[ind - 2] + "\\cdot " + ex[ind - 1];
				else
					ep = ex[ind - 2] + "" + ex[ind - 1];
			}
			if (v[i] == 8)
				ep = "\\frac {" + ex[ind - 2] + "}{" + ex[ind - 1] + "}";
			if (v[i] == 9) {
				if (exodr[ind - 2] < 3)
					ex[ind - 2] = "\\left (" + ex[ind - 2] + "\\right )";
				ep = ex[ind - 2] + "^{" + ex[ind - 1] + "}";
			}
			exodr[ind - 2] = odr[v[i] - 5];
			ex[ind - 2] = ep;
			ex[ind - 1] = "";
			exodr[ind - 1] = -1;
			ind--;
		}

		if (v[i] == 10) {
			if (exodr[ind - 1] < 3)
				ex[ind - 1] = "\\left (" + ex[ind - 1] + "\\right )";
			ex[ind - 1] = ex[ind - 1] + "!";
			exodr[ind - 1] = 2;
		}
	}

	return ex[0];
}

void EMSCRIPTEN_KEEPALIVE templateSearch(vi &t, int c, int o, int d) {
	if (c + o == 0) {
		templates.push_back(t);
		return;
	}
	if (c > 0) {
		t.push_back(0);
		templateSearch(t, c - 1, o, d + 1);
		t.pop_back();
	}
	if (o > 0 && d > 1) {
		t.push_back(1);
		templateSearch(t, c, o - 1, d - 1);
		t.pop_back();
	}
	return;
}

void EMSCRIPTEN_KEEPALIVE makeSequence(vi &s, int idx, int tidx) {
	if (idx == s.size()) {
		sequences.push_back(s);
		// insert 1 factorial
		// s.push_back(10);
		// sequences.push_back(s);
		// for (int i = s.size() - 2; i > 0; i--) {
		// 	s[i + 1] = s[i];
		// 	s[i] = 10;
		// 	sequences.push_back(s);
		// }
		// s.pop_back();
		return;
	}
	if (templates[tidx][idx] == 0) {
		for (int i = 0; i < 5; i++) {
			s[idx] = i;
			makeSequence(s, idx + 1, tidx);
		}
	}
	else {
		for (int i = 5; i < 10; i++) {
			s[idx] = i;
			makeSequence(s, idx + 1, tidx);
		}
	}
	return;
}

long double EMSCRIPTEN_KEEPALIVE evaluate(vi v) {
	vector<long double> stack;
	for (int i = 0; i < v.size(); i++) {
		if (v[i] < 5) {
			stack.push_back(constants[v[i]]);
		}
		else if (v[i] < 10) {
			long double a = stack[stack.size() - 2];
			long double b = stack[stack.size() - 1];
			stack.pop_back();
			long double ans;
			if (v[i] == 5)
				ans = a + b;
			else if (v[i] == 6)
				ans = a - b;
			else if (v[i] == 7)
				ans = a * b;
			else if (v[i] == 8) {
				if (abs(b) < 1e-6)
					return DBL_MAX;
				ans = a / b;
			}
			else if (v[i] == 9) {
				if (a < 1e-6)
					return DBL_MAX;
				ans = pow(a, b);
			}
			stack[stack.size() - 1] = ans;
		}
		else {
			stack[stack.size() - 1] = tgamma(stack[stack.size() - 1] + 1);
		}
	}
	return stack[0];
}

pdv EMSCRIPTEN_KEEPALIVE approximate(long double target, long double eps) {
	// printf("Approximating %.15Le, eps = %.15Le\n", target, eps);
	if (eps < 0) {
		return pdv();
	}
	int idx = lower_bound(pairs.begin(), pairs.end(), pdv(target, vector<int>())) - pairs.begin();
	if (abs(pairs[idx - 1].first - target) < abs(pairs[idx].first - target))
		idx--;
	long double approx = pairs[idx].first;
	vi ans = pairs[idx].second;
	long double error = abs(target - approx);
	if (target == 0 || (error < eps && abs(abs(approx / target) - 1) < eps))
		return pdv(approx, ans);
	if (abs(target) > 1e4 || abs(target) < 1e-4) {
		pdv errorApprox = approximate(target / approx, abs(eps / approx));
		ans.insert(ans.end(), errorApprox.second.begin(), errorApprox.second.end());
		ans.push_back(7);
		return pdv(approx * errorApprox.first, ans);
	}
	else {
		pdv errorApprox = approximate(error, eps);
		ans.insert(ans.end(), errorApprox.second.begin(), errorApprox.second.end());
		if (approx < target) {
			ans.push_back(5); // add error to approx
			return pdv(approx + errorApprox.first, ans);
		}
		else {
			ans.push_back(6); // subtract error from approx
			return pdv(approx - errorApprox.first, ans);
		}
	}
}



extern "C" {
	const char* EMSCRIPTEN_KEEPALIVE run(char* targetString) {
		long double target = stold(targetString);
		cout << target << endl;
		vi t;
		t.push_back(0);
		for (int i = 0; i < 4; i++) {
			int j = templates.size();
			templateSearch(t, i, i, 1);
			vi s(2 * i + 1);
			for (; j < templates.size(); j++) {
				makeSequence(s, 0, j);
			}
		}
		for (int i = 0; i < sequences.size(); i++) {
			pairs.push_back(pdv(evaluate(sequences[i]), sequences[i]));
		}
		sort(pairs.begin(), pairs.end());

		pdv p = approximate(target, 1e-3);
		// printf("%.20Le\n", p.first);
		int precision = -(int)log10(abs(target - p.first)) + 2;
		stringstream stream;
		cout << latexfy(p.second) << endl;
		cout << fixed << endl;
		stream << latexfy(p.second) << " = " << fixed << setprecision(precision) << p.first << endl;
		return stream.str().c_str();
	}
}
