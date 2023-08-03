const inputString = `How to Think Like a Roman Emperor: The Stoic Philosophy of Marcus Aurelius (Donald Robertson)
- Ihre Markierung auf Seite 7 | bei Position 96-96 | Hinzugefügt am Freitag, 8. Mai 2020 17:23:15

ancient Gnostic texts discovered at Nag Hammadi in Egypt,
==========
How to Think Like a Roman Emperor: The Stoic Philosophy of Marcus Aurelius (Donald Robertson)
- Ihre Notiz auf Seite 7 | bei Position 96 | Hinzugefügt am Freitag, 8. Mai 2020 17:23:22

Research
==========
How to Think Like a Roman Emperor: The Stoic Philosophy of Marcus Aurelius (Donald Robertson)
- Ihre Markierung auf Seite 10 | bei Position 149-151 | Hinzugefügt am Freitag, 8. Mai 2020 17:25:51

The potential value of Stoicism struck me immediately when I stumbled across the French scholar Pierre Hadot’s What Is Ancient Philosophy? (1998) and Philosophy as a Way of Life (2004).
==========
How to Think Like a Roman Emperor: The Stoic Philosophy of Marcus Aurelius (Donald Robertson)
- Ihre Markierung auf Seite 11 | bei Position 164-165 | Hinzugefügt am Freitag, 8. Mai 2020 17:26:42

rational emotive behavior therapy (REBT),
==========`

const extractHighlights = () => {
  const bookEntries = []
  const bookRegex = /(.+) \((.+)\)/
  const bookInfoRegex = /Seite (\d+) \| bei Position (\d+)-(\d+) \| Hinzugefügt am (.+)/
  const bookInfoRegexShort = /Seite (\d+) \| bei Position (\d+) \| Hinzugefügt am (.+)/

  let currentBookEntry = {}
  let lineInfo = 'book'

  let lines = inputString.split('\n')

  for (const line of lines) {
    if (line === '==========') {
      if (Object.keys(currentBookEntry).length !== 0) {
        bookEntries.push(currentBookEntry)
        currentBookEntry = {}
      }
      lineInfo = 'book'
    } else if (lineInfo === 'book') {
      lineInfo = 'info'
      const match = inputString.match(bookRegex)
      if (match) {
        currentBookEntry.title = match[1]
        currentBookEntry.author = match[2]
      }
    } else {
      const match = line.match(bookInfoRegex)
      if (match) {
        const [, page, start, end, date ] = match
        currentBookEntry.page = parseInt(page)
        currentBookEntry.start = parseInt(start)
        currentBookEntry.end = parseInt(end)
        currentBookEntry.date = date
      } else {
        const matchShort = line.match(bookInfoRegexShort)
        if (matchShort) {
          const [, page, start, date ] = matchShort
          currentBookEntry.page = parseInt(page)
          currentBookEntry.start = parseInt(start)
          currentBookEntry.end = parseInt(start)
          currentBookEntry.date = date
        }
      }
    }
  }
  return bookEntries
}

module.exports = extractHighlights


