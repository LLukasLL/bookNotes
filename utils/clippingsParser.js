/*
const testString = `How to Think Like a Roman Emperor: The Stoic Philosophy of Marcus Aurelius (Donald Robertson)
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
==========
How to Think Like a Roman Emperor: The Stoic Philosophy of Marcus Aurelius (Donald Robertson)
- Ihre Markierung auf Seite 32 | bei Position 478-481 | Hinzugefügt am Freitag, 8. Mai 2020 17:44:52

However, it can also be a bad thing if it becomes so pedantic or overly “academic” that it diverts us from the pursuit of virtue. Marcus learned the same attitude from his Stoic teachers. He repeatedly warned himself not to become distracted by reading too many books—thus wasting time on trifling issues in logic and metaphysics—but instead to remain focused on the practical goal of living wisely. After studying philosophy in Athens for about two
==========`
*/

const extractHighlights = inputString => {
  const bookEntries = []
  const bookRegex = /(.+) \((.+)\)/
  const bookInfoRegex = /Seite (\d+) \| bei Position (\d+)-(\d+) \| Hinzugefügt am (.+)/
  const bookInfoRegexShort = /Seite (\d+) \| bei Position (\d+) \| Hinzugefügt am (.+)/

  let currentBookEntry = {}
  let lineInfo = 'book'

  let lines
  inputString.includes('\r\n')
    ? lines = inputString.split('\r\n')
    : lines = inputString.split('\n')

  for (const line of lines) {
    if (line === '==========' || line.includes('==========')) {
      if (Object.keys(currentBookEntry).length !== 0) {
        bookEntries.push(currentBookEntry)
        currentBookEntry = {}
      }
      lineInfo = 'book'
    } else if (lineInfo === 'book') {
      const match = line.match(bookRegex)
      if (match) {
        currentBookEntry.book = match[1]
        currentBookEntry.author = match[2]
      }
      lineInfo = 'info'
    } else if (line === '' || line === null || line === '\r\n') {
      lineInfo = 'highlight'
    } else if (lineInfo === 'highlight' ) {
      currentBookEntry.highlight = line
      lineInfo = '=========='
    } else {
      const match = line.match(bookInfoRegex)
      if (match) {
        const [, page, start, end, date ] = match
        currentBookEntry.page = parseInt(page)
        currentBookEntry.locationStart = parseInt(start)
        currentBookEntry.locationEnd = parseInt(end)
        currentBookEntry.date = date
        lineInfo = 'empty'
      } else {
        const matchShort = line.match(bookInfoRegexShort)
        if (matchShort) {
          const [, page, start, date ] = matchShort
          currentBookEntry.page = parseInt(page)
          currentBookEntry.locationStart = parseInt(start)
          currentBookEntry.locationEnd = parseInt(start)
          currentBookEntry.date = date
          lineInfo = 'empty'
        }
      }
    }
  }
  return bookEntries
}

module.exports = extractHighlights

// console.log(extractHighlights(testString))
