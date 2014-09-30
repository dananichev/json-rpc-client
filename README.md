json-rpc-client
===============

Minimalistic JSON-RPC client

Usage
===============
Include this script on the page via AMD loader. And intialize it:
```javascript
rpc.init();
rpc.serviceUrl('http://url/to/service');
rpc.token('token');
```
Use ```rpc.sendPacket()``` method to communicate with service and events ```success``` and ```error``` to handle response from the server.
```javascript
rpc.addEventListener('success', function(resp) {
  console.log(resp);
});
rpc.addEventListener('error', function(xhr) {
  console.log(xhr);
});
```
