[![Netlify Status](https://api.netlify.com/api/v1/badges/15514978-84e8-414a-ab28-30769865d3e4/deploy-status)](https://app.netlify.com/sites/lively-lamington-133392/deploys)

### Wishlist

- [x] Drag and Drop Song
- [x] Play count in
- [x] Custom BPM
- [x] Custom # of beats
- [x] Custom start time
- [ ] Fine increment start time
- [x] Reset to start time
- [ ] Custom end time
- [ ] Custom loop
- [ ] Custom loop count
- [x] MUI 5
- [ ] YouTube API

---

## Resuming Notes

- Move the video components to a class component that returns the right player given the source
  - Add a YouTube player
  - Add drag n drop file player
    - mp3
    - wav
- Need a controller component
  - Play/Pause
  - Stop
  - Restart
  - Set start (with increment)
  - Set BPM with Tap Tempo
  - Set # of beats / count in
- Timeline
