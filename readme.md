# off-the-hook

Get a streaming sse endpoint for a webhook with permissive CORS headers.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## env
* `SEND_ENDPOINT` secret endpoint where messages are posted to
* `PORT` port to listen to (default 8080)

## usage with github webhooks

1. Set the `SEND_ENDPOINT` env variable to a pass phrase (e.g. random value)
2. Go to the settings of a repository and click `Webhooks & Services`
3. Click `Add webhook`
4. As a `Payload URL` add `http://yoururl/{SEND_ENDPOINT}` (replacing it with your pass phrase)
5. Choose the type of events you want to receive by clicking `Let me select individual events.`
6. Click `Add webhook`
7. You now receive the events at `http://yoururl/`

This means you could use it in a browser like this:
```js
var events = new EventSource('http://yoururl/')
events.onmessage = function (message) {
  console.log(JSON.parse(message.data)) 
}
```