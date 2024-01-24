# Sesh Alerts Bot

Made to solve a problem, does a single job, alerts people of the current sesh.

Configurable to different roles and channels, with global cooldowns and per-user cooldowns to prevent anyone getting mention spammed.

---

Configuration example: \
*this will go into `src/config.ts` before building the image or running the dev build*

```typescript
'824008760279957555': {
  roles: {
    seshAlerts: '857673029064589342', // Smoke Squad Role
    member: '824492382607114251' // Member Role
  },
  channels: {
    general: '824025570467250236', // General Channel
    roles: '824022223831433237', // Roles channel (where you get Smoke Squad)
    seshVoice: [
      '824008760845402195', // Sesh Circle
      '981307943582568538' // Secondary Sesh Circle
    ]
  },
  cooldown: {
    global: 300, // 5 minutes in seconds
    perUser: 600 // 10 minutes in seconds
  }
}
```

---

Video of what this does:

![demo video](https://files.dstn.to/b4a21ca6392752ff.gif)

In the demo you can see that it won't let you run it in a private channel, and requires you to be in the voice channel, something not shown here is that you also have to have the configured sesh alerts role to run the command.