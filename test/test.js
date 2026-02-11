const v = {a:1, b:2, c:3};

for (const key in v) {
    console.log(`${key}: ${v[key]}`);
}