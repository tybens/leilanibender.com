function foo(a, b) {
  const object = { a, b };
  return object.a + object.b;
}

for (var i = 0; i < 1000000000; i++) {
  foo(Math.random(), Math.random())
}
