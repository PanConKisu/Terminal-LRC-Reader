const fs = require('fs');

const readline = require('readline');

function parseLRC(lrcContent) {
  const lines = lrcContent.split('\n');
  const lyrics = [];

  for (const line of lines) {
    const match = line.match(/\[(\d+:\d+\.\d+)\](.+)/);
    if (match) {
      const time = match[1];
      const text = match[2];
      lyrics.push({ time, text });
    }
  }

  return lyrics
}

function displayLyrics(parsedLyrics, audioStartTime) {
  let currentIndex = 0;

  const intervalId = setInterval(() => {
    const currentLyric = parsedLyrics[currentIndex];
    if (currentLyric) {
      const lyricTime = currentLyric.time.split(':')
      const lyricSeconds = parseInt(lyricTime[0]) * 60 + parseFloat(lyricTime[1]);
      const currentTime = Date.now() / 1000 - audioStartTime;

      if (lyricSeconds <= currentTime) {
        console.log(currentLyric.text);
        currentIndex++;
      }
    } else {
      clearInterval(intervalId);
      process.exit();
    }
  }, 100);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Archivo .lrc: ', (filename) => {
  rl.close();

  fs.readFile(filename, 'utf8', (err,data) => {
    if (err) {
      console.error('Error al leer tu cagá de archivo:', err);
      process.exit(1);
    }

    const parsedLyrics = parseLRC(data);

    console.log('Esperando confimacion. Para comenzar, presiona Enter.');

    let audioStartTime = 0;

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', () => {
      process.stdin.setRawMode(false);
      audioStartTime = Date.now() / 1000;
      console.log('\nComenzando la reproduccion...\n');
      displayLyrics(parsedLyrics, audioStartTime);

    });
  });
});