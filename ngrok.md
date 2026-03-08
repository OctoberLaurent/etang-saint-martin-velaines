# ngrok User Guide

This document explains how to share your local project on the internet using ngrok, how to find the generated public URL, and how to stop sharing.

## 1. Start Sharing (Expose a Local Port)

To share your project securely, you need to tell ngrok which local port to listen to. For example, if your local server (Live Server, Vite, or other) is running on port `5500`, open your terminal and run the following command:

```bash
ngrok http 5500
```

*Replace `5500` with the port number used by your project.*

## 2. Find the Public URL

Once the command is running, ngrok displays a control interface directly in your terminal.

- Look for the line labeled **`Forwarding`**.
- Right next to this line is your secure public URL (it often starts with `https://` and ends with `.ngrok-free.app`).
- Copy this link to share it with others or to test it on your other devices (like your smartphone).

### Tip: Find the URL via the Local API
If ngrok is running in the background or you want to retrieve the URL programmatically, ngrok exposes a small local administration API on port `4040`. You can query this API from another terminal using the following command:

```bash
curl -s http://127.0.0.1:4040/api/tunnels
```

This will return the details of the active tunnel in JSON format, where you can find the `"public_url"`.

## 3. Stop Sharing

To stop sharing and close the ngrok tunnel:

- Go back to the terminal window where ngrok is running.
- Press the keyboard shortcut **`Ctrl + C`** (even on Mac).
- The program will quit. At this point, the public `.ngrok-free.app` address will no longer work, and your project will no longer be accessible from the outside.
