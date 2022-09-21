class c {
  name = "asd";

  cn1() {
    this.name = "a";
  }

  cn3 = () => {
    this.name = "c";
  };
}

const cc = new c();

cc.cn1();
console.log(cc.name);

cc.cn3();
console.log(cc.name);
