function print (msg) {
  console.log("[*] " + msg);
}

function assert (outcome) {  
  if (!outcome) {
    throw new Error("assertion failed");
  }
}
