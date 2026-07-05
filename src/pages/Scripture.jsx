import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import UserInboxBadge from '../components/UserInboxBadge'

const TRANSLATIONS = [
  {
    language: 'English',
    versions: [
      { code: 'WEB', name: 'World English Bible' },
      { code: 'KJV', name: 'King James Version' },
      { code: 'NKJV', name: 'New King James Version' },
      { code: 'NIV', name: 'New International Version (1984)' },
      { code: 'NIV2011', name: 'New International Version (2011)' },
      { code: 'ESV', name: 'English Standard Version' },
      { code: 'NASB', name: 'New American Standard Bible' },
      { code: 'NLT', name: 'New Living Translation' },
      { code: 'AMP', name: 'Amplified Bible' },
      { code: 'MSG', name: 'The Message' },
    ]
  },
  {
    language: 'Spanish',
    versions: [
      { code: 'RV1960', name: 'Reina-Valera 1960' },
      { code: 'NVI', name: 'Nueva Versión Internacional 2015' },
      { code: 'NTV', name: 'Nueva Traducción Viviente' },
    ]
  },
  {
    language: 'French',
    versions: [
      { code: 'NBS', name: 'Nouvelle Bible Segond 2002' },
      { code: 'FRLSG', name: 'Bible Segond 1910' },
      { code: 'BDS', name: 'La Bible du Semeur 2015' },
    ]
  },
  {
    language: 'Hebrew (OT Only)',
    versions: [
      { code: 'WLC', name: 'Westminster Leningrad Codex' },
      { code: 'WLCa', name: 'Westminster Leningrad Codex (Strong\'s)' },
    ]
  },
  {
    language: 'Chinese',
    versions: [
      { code: 'CUV', name: '和合本 Traditional' },
      { code: 'CUNPS', name: '新标点和合本 Simplified' },
    ]
  },
]

const HEBREW_TRANSLATIONS = ['WLC', 'WLCa', 'WLCC', 'HAC']
const NT_BOOKS = ['Matthew', 'Mark', 'Luke', 'John']
const STRONGS_TRANSLATIONS = ['KJV', 'ASV', 'WLC', 'WLCa', 'WLCC', 'HAC', 'DSV']

const LANGUAGE_CODES = {
  'RV1960': 'Spanish', 'NVI': 'Spanish', 'NTV': 'Spanish',
  'NBS': 'French', 'FRLSG': 'French', 'BDS': 'French',
  'WLC': 'Hebrew', 'WLCa': 'Hebrew',
  'CUV': 'Chinese', 'CUNPS': 'Chinese',
}

const BOOK_IDS = {
  'John': 43, 'Matthew': 40, 'Mark': 41, 'Luke': 42,
  'Psalms': 19, 'Proverbs': 20, 'Ecclesiastes': 21, 'Song of Solomon': 22,
}

const BEGINNER_PLAN = [
  { book: 'John', chapters: 21 },
  { book: 'Matthew', chapters: 28 },
  { book: 'Mark', chapters: 16 },
  { book: 'Luke', chapters: 24 },
]

const WISDOM_PLAN = [
  { book: 'Proverbs', chapters: 31 },
  { book: 'Ecclesiastes', chapters: 12 },
  { book: 'Song of Solomon', chapters: 8 },
]

const MESSIANIC_PROPHECIES = [
  { reference: 'Genesis 3:15', description: 'The first prophecy — the seed of woman will crush the serpent' },
  { reference: 'Genesis 12:1-3', description: 'Through Abraham all nations will be blessed' },
  { reference: 'Isaiah 7:14', description: 'A virgin will conceive and give birth to Immanuel' },
  { reference: 'Isaiah 9:6-7', description: 'A child born, a son given — Wonderful Counselor, Prince of Peace' },
  { reference: 'Micah 5:2', description: 'The Messiah will be born in Bethlehem' },
  { reference: 'Psalm 22:1-18', description: 'The crucifixion described 1000 years before it happened' },
  { reference: 'Isaiah 53:1-12', description: 'The suffering servant — the most detailed prophecy of the cross' },
  { reference: 'Zechariah 9:9', description: 'The king comes riding on a donkey' },
  { reference: 'Psalm 16:10', description: 'He will not be abandoned to the grave' },
  { reference: 'Daniel 7:13-14', description: 'The Son of Man comes with the clouds of heaven' },
]

function getDayReading(day) {
  let gospelBook = '', gospelChapter = 0
  let remaining = day
  for (const g of BEGINNER_PLAN) {
    if (remaining <= g.chapters) { gospelBook = g.book; gospelChapter = remaining; break }
    remaining -= g.chapters
  }
  const psalmChapter = day
  let wisdomBook = '', wisdomChapter = 0, wisdomRef = null
  const totalWisdom = WISDOM_PLAN.reduce((a, b) => a + b.chapters, 0)
  if (day <= totalWisdom) {
    let wr = day
    for (const w of WISDOM_PLAN) {
      if (wr <= w.chapters) { wisdomBook = w.book; wisdomChapter = wr; break }
      wr -= w.chapters
    }
  } else {
    wisdomRef = MESSIANIC_PROPHECIES[(day - totalWisdom - 1) % MESSIANIC_PROPHECIES.length]
  }
  return { gospelBook, gospelChapter, psalmChapter, wisdomBook, wisdomChapter, wisdomRef }
}

function extractNIVHeading(rawText) {
  const plain = rawText.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  const junctionMatch = plain.match(/^(.*?[a-z])([A-Z][a-z].*)$/)
  if (junctionMatch) {
    const heading = junctionMatch[1].trim()
    const verseText = junctionMatch[2].trim()
    if (!heading.match(/[.,;:!?"]$/) && heading.split(' ').length >= 2 && heading.length < 150) {
      return { heading, verseText }
    }
  }
  return { heading: null, verseText: plain }
}

function parsePsalmVerse1NIV(rawText) {
  let text = rawText.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  let bookHeader = null
  let superscription = null

  const bookMatch = text.match(/^(BOOK\s*[IVX]+\s*Psalms?\s*[\d\u2013\-]+\s*Psalm\s*\d+)\s*(.+)$/i)
  if (bookMatch) {
    const rawHeader = bookMatch[1].trim()
    bookHeader = rawHeader
      .replace(/^(BOOK\s*[IVX]+)(Psalms?)/i, '$1. $2')
      .replace(/(Psalms?\s*[\d\u2013\-]+)(Psalm)/i, '$1. $2')
      .trim() + '.'
    text = bookMatch[2].trim()
  }

  if (!bookHeader) {
    const psalmNumMatch = text.match(/^(Psalm\s*\d+)([A-Z].+)$/i)
    if (psalmNumMatch) {
      bookHeader = psalmNumMatch[1].trim() + '.'
      text = psalmNumMatch[2].trim()
    }
  }

  const superKeywords = /^(for the|a psalm|psalm of|with|on |when |according|of david|of asaph|of korah|prayer|petition|song|maskil|miktam|shiggaion|gittith|mahalath|jeduthun|director|music|chief|flute|pipe|string|harp|lyre|selah)/i

  if (superKeywords.test(text)) {
    text = text
      .replace(/\.\s*([A-Z])/g, '. $1')
      .replace(/,\s*([A-Z])/g, ', $1')
      .replace(/;\s*([a-zA-Z])/g, '; $1')
      .replace(/!\s*([A-Z])/g, '! $1')
      .replace(/\?\s*([A-Z])/g, '? $1')

    const sentences = text.split(/(?<=\.)\s+/)
    const superParts = []
    let verseStart = 0

    for (let i = 0; i < sentences.length; i++) {
      const s = sentences[i]
      if (/director|music|psalm|david|asaph|korah|maskil|miktam|shiggaion|gittith|mahalath|jeduthun|flute|pipe|string|harp|lyre|song|prayer|petition|when|according|chief|selah|stringed|instruments/i.test(s)) {
        superParts.push(s)
        verseStart = i + 1
      } else {
        break
      }
    }

    if (superParts.length > 0) {
      superscription = superParts.join(' ').trim()
      text = sentences.slice(verseStart).join(' ').trim()
    }
  }

  if (!superscription && text) {
    const fixed = text
      .replace(/\.\s*([A-Z])/g, '. $1')
      .replace(/,\s*([A-Z])/g, ', $1')
      .replace(/;\s*([a-zA-Z])/g, '; $1')

    const sentences = fixed.split(/(?<=\.)\s+/)
    const superParts = []
    let verseStart = 0

    for (let i = 0; i < sentences.length; i++) {
      const s = sentences[i]
      if (/director|music|psalm|david|asaph|korah|maskil|miktam|shiggaion|gittith|mahalath|jeduthun|flute|pipe|string|harp|lyre|song|prayer|petition|when|according|chief|selah|stringed|instruments/i.test(s)) {
        superParts.push(s)
        verseStart = i + 1
      } else {
        break
      }
    }

    if (superParts.length > 0) {
      superscription = superParts.join(' ').trim()
      text = sentences.slice(verseStart).join(' ').trim()
    } else {
      text = fixed
    }
  }

  text = text
    .replace(/\.\s*([A-Z])/g, '. $1')
    .replace(/,\s*([A-Z])/g, ', $1')
    .replace(/;\s*([a-zA-Z])/g, '; $1')
    .replace(/!\s*([A-Z])/g, '! $1')
    .replace(/\?\s*([A-Z])/g, '? $1')
    .trim()

  return { bookHeader, superscription, verseText: text }
}

function cleanVerseText(rawText, translation) {
  let text = rawText.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  if (STRONGS_TRANSLATIONS.includes(translation)) {
    text = text.replace(/\d+/g, '').replace(/\s+/g, ' ').trim()
  }
  return text
}

async function fetchChapter(translation, bookName, chapter) {
  try {
    const bookId = BOOK_IDS[bookName]
    if (!bookId) return null
    const res = await fetch(`https://bolls.life/get-text/${translation}/${bookId}/${chapter}/`)
    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) return null
    return data
  } catch { return null }
}

function buildHeadingMap(nivVerses) {
  const map = {}
  if (!nivVerses) return map
  nivVerses.forEach(v => {
    const { heading } = extractNIVHeading(v.text || '')
    if (heading) map[v.verse] = heading
  })
  return map
}

async function translateHeadings(headingMap, targetLanguage) {
  const headings = Object.values(headingMap)
  if (headings.length === 0) return headingMap
  try {
    const res = await fetch('/.netlify/functions/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `Translate these Bible section headings to ${targetLanguage}. 
Return ONLY a JSON array of translated strings in the same order, nothing else.
Headings: ${JSON.stringify(headings)}`
        }]
      })
    })
    const data = await res.json()
    const text = data.content?.[0]?.text || '[]'
    const clean = text.replace(/```json|```/g, '').trim()
    const translated = JSON.parse(clean)
    const newMap = {}
    Object.keys(headingMap).forEach((verse, i) => {
      newMap[verse] = translated[i] || headingMap[verse]
    })
    return newMap
  } catch { return headingMap }
}

async function translatePsalmMeta(bookHeader, superscription, targetLanguage) {
  try {
    const res = await fetch('/.netlify/functions/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `Translate these Psalm header texts to ${targetLanguage}.
Return ONLY a JSON object with keys "bookHeader" and "superscription", nothing else.
Input: ${JSON.stringify({ bookHeader, superscription })}`
        }]
      })
    })
    const data = await res.json()
    const text = data.content?.[0]?.text || '{}'
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch { return { bookHeader, superscription } }
}

async function fetchHebrewPhonetics(verses, psalmNumber) {
  // Check cache first
  if (psalmNumber) {
    const { data: cached } = await supabase
      .from('phonetics_cache')
      .select('phonetics')
      .eq('psalm_number', psalmNumber)
    if (cached?.[0]) {
      return JSON.parse(cached[0].phonetics)
    }
  }

  try {
    const verseTexts = verses.map(v => ({
      verse: v.verse,
      text: v.text.replace(/<[^>]*>/g, '').replace(/\d+/g, '').trim()
    }))
    const res = await fetch('/.netlify/functions/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `Provide phonetic pronunciation (transliteration into English letters) for each of these Hebrew Bible verses.
Return ONLY a JSON object where keys are verse numbers (as numbers) and values are the phonetic pronunciation strings. Nothing else.
Verses: ${JSON.stringify(verseTexts)}`
        }]
      })
    })
    const data = await res.json()
    const text = data?.content?.[0]?.text || '{}'
    const clean = text.replace(/```json|```/g, '').trim()
    const phonetics = JSON.parse(clean)

    // Save to cache
    if (psalmNumber && Object.keys(phonetics).length > 0) {
      await supabase.from('phonetics_cache').insert([{
        psalm_number: psalmNumber,
        phonetics: JSON.stringify(phonetics),
        created_at: new Date().toISOString()
      }])
    }

    return phonetics
  } catch { return {} }
}

export default function Scripture({ setScreen, user, username, avatarUrl, onAvatarChange, unreadCount, onOpenInbox, scriptureDay, setScriptureDay, scriptureDayLoaded, setScriptureDayLoaded }) {
  const day = scriptureDay
  const setDay = setScriptureDay
  const [loading, setLoading] = useState(true)
  const [activeReading, setActiveReading] = useState('gospel')
  const [bibleText, setBibleText] = useState(null)
  const [bibleLoading, setBibleLoading] = useState(false)
  const [headingMap, setHeadingMap] = useState({})
  const [psalmMeta, setPsalmMeta] = useState({ bookHeader: null, superscription: null })
  const [hebrewPhonetics, setHebrewPhonetics] = useState({})
  const [commentary, setCommentary] = useState('')
  const [commentaryLoading, setCommentaryLoading] = useState(false)
  const [reflection, setReflection] = useState('')
  const [savedReflection, setSavedReflection] = useState('')
  const [savingReflection, setSavingReflection] = useState(false)
  const [status, setStatus] = useState('')
  const [videos, setVideos] = useState([])
  const [newVideoUrl, setNewVideoUrl] = useState('')
  const [newVideoTitle, setNewVideoTitle] = useState('')
  const [showAddVideo, setShowAddVideo] = useState(false)
  const [showTranslationPicker, setShowTranslationPicker] = useState(false)
  const [selectedTranslation, setSelectedTranslation] = useState('WEB')

  const reading = getDayReading(day)
  const isHebrewSelected = HEBREW_TRANSLATIONS.includes(selectedTranslation)
  const currentBook = activeReading === 'gospel' ? reading.gospelBook :
                      activeReading === 'psalm' ? 'Psalms' : reading.wisdomBook
  const hebrewNTWarning = isHebrewSelected && NT_BOOKS.includes(currentBook)
  const targetLanguage = LANGUAGE_CODES[selectedTranslation] || null

  useEffect(() => { loadProgress() }, [user])
  useEffect(() => { if (!loading) loadBibleText() }, [day, activeReading, loading, selectedTranslation])

  const loadProgress = async () => {
    if (!user) return
    if (!scriptureDayLoaded) {
      const { data } = await supabase.from('reading_progress').select('*').eq('user_id', user.id)
      if (data?.[0]) setDay(data[0].day)
      setScriptureDayLoaded(true)
    }
    setLoading(false)
  }

  const loadBibleText = async () => {
    setBibleText(null)
    setHeadingMap({})
    setPsalmMeta({ bookHeader: null, superscription: null })
    setHebrewPhonetics({})
    setCommentary('')
    setSavedReflection('')
    setVideos([])
    if (hebrewNTWarning) return

    let book = '', chapter = 0
    if (activeReading === 'gospel') { book = reading.gospelBook; chapter = reading.gospelChapter }
    else if (activeReading === 'psalm') { book = 'Psalms'; chapter = reading.psalmChapter }
    else if (activeReading === 'wisdom' && reading.wisdomBook) { book = reading.wisdomBook; chapter = reading.wisdomChapter }
    if (!book || !chapter) return

    setBibleLoading(true)

    const [nivData, selectedData] = await Promise.all([
      fetchChapter('NIV', book, chapter),
      selectedTranslation === 'NIV' ? Promise.resolve(null) : fetchChapter(selectedTranslation, book, chapter)
    ])

    // For Psalms — extract book header and superscription from NIV, then translate if needed
    if (activeReading === 'psalm' && nivData && nivData.length > 0) {
      let { bookHeader, superscription } = parsePsalmVerse1NIV(nivData[0].text || '')
      if (targetLanguage && (bookHeader || superscription)) {
        const translated = await translatePsalmMeta(bookHeader, superscription, targetLanguage)
        if (translated.bookHeader) bookHeader = translated.bookHeader
        if (translated.superscription) superscription = translated.superscription
      }
      setPsalmMeta({ bookHeader, superscription })
    }

    // For Gospels and Wisdom — build heading map from NIV, translate if needed
    let map = {}
    if (activeReading !== 'psalm') {
      map = buildHeadingMap(nivData)
      if (targetLanguage && Object.keys(map).length > 0) {
        map = await translateHeadings(map, targetLanguage)
      }
    }
    setHeadingMap(map)

    const displayData = selectedTranslation === 'NIV' ? nivData : (selectedData || nivData)

    // Fetch Hebrew phonetics if Hebrew translation selected
    if (isHebrewSelected && displayData) {
      const psalmNumber = activeReading === 'psalm' ? reading.psalmChapter : null
      const phonetics = await fetchHebrewPhonetics(displayData, psalmNumber)
      setHebrewPhonetics(phonetics)
    }

    setBibleText(displayData)
    setBibleLoading(false)

    loadVideos(book, chapter)
    loadReflection(book, chapter)
  }

  const loadReflection = async (book, chapter) => {
    const { data } = await supabase.from('reading_logs').select('reflection').eq('user_id', user.id).eq('book', book).eq('chapter', chapter)
    if (data?.[0]) setSavedReflection(data[0].reflection || '')
  }

  const loadVideos = async (book, chapter) => {
    const { data } = await supabase.from('scripture_videos').select('*').eq('book', book).eq('chapter', chapter)
    if (data) setVideos(data)
  }

  const getCommentary = async () => {
    setCommentaryLoading(true)
    let ref = ''
    let book = '', chapter = 0
    if (activeReading === 'gospel') { ref = `${reading.gospelBook} chapter ${reading.gospelChapter}`; book = reading.gospelBook; chapter = reading.gospelChapter }
    else if (activeReading === 'psalm') { ref = `Psalm ${reading.psalmChapter}`; book = 'Psalms'; chapter = reading.psalmChapter }
    else if (activeReading === 'wisdom') { ref = `${reading.wisdomBook} chapter ${reading.wisdomChapter}`; book = reading.wisdomBook; chapter = reading.wisdomChapter }

    // Check cache first
    const { data: cached } = await supabase
      .from('commentary_cache')
      .select('commentary')
      .eq('book', book)
      .eq('chapter', chapter)
      .single()

    if (cached) {
      setCommentary(cached.commentary)
      setCommentaryLoading(false)
      return
    }

    // Not in cache — generate fresh
    try {
      const res = await fetch('/.netlify/functions/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are a warm, encouraging Bible teacher speaking to a beginner Christian. 
            Please provide a commentary on ${ref} that:
            1. Explains the main themes in simple, clear language
            2. Gives historical or cultural context where helpful
            3. Connects this passage to the overall story of Jesus and God's love
            4. Ends with one meaningful reflection question for the reader
            Keep it encouraging, accessible, and under 300 words.`
          }]
        })
      })
      const data = await res.json()
      const text = data?.content?.[0]?.text || data?.error || 'Commentary unavailable.'
      setCommentary(text)

      // Save to cache
      if (text && text !== 'Commentary unavailable.') {
        await supabase.from('commentary_cache').insert([{
          book, chapter, commentary: text, created_at: new Date().toISOString()
        }])
      }
    } catch { setCommentary('Commentary unavailable at this time. Please try again.') }
    setCommentaryLoading(false)
  }

  const saveReflection = async () => {
    if (!reflection.trim()) return
    setSavingReflection(true)
    let book = '', chapter = 0
    if (activeReading === 'gospel') { book = reading.gospelBook; chapter = reading.gospelChapter }
    else if (activeReading === 'psalm') { book = 'Psalms'; chapter = reading.psalmChapter }
    else if (activeReading === 'wisdom') { book = reading.wisdomBook; chapter = reading.wisdomChapter }
    const { data: existing } = await supabase.from('reading_logs').select('id').eq('user_id', user.id).eq('book', book).eq('chapter', chapter)
    if (existing?.[0]) {
      await supabase.from('reading_logs').update({ reflection: reflection.trim(), completed_at: new Date().toISOString() }).eq('id', existing[0].id)
    } else {
      await supabase.from('reading_logs').insert([{ user_id: user.id, book, chapter, reflection: reflection.trim(), completed_at: new Date().toISOString() }])
    }
    setSavedReflection(reflection.trim())
    setReflection('')
    setStatus('Reflection saved!')
    setSavingReflection(false)
  }

  const markAsRead = async () => {
    const nextDay = day + 1
    await supabase.from('reading_progress').upsert([{ user_id: user.id, day: nextDay }], { onConflict: 'user_id' })
    setDay(nextDay)
    setActiveReading('gospel')
    setStatus(`Day ${day} complete! Moving to Day ${nextDay}.`)
  }

  const addVideo = async () => {
    if (!newVideoUrl.trim()) return
    let book = '', chapter = 0
    if (activeReading === 'gospel') { book = reading.gospelBook; chapter = reading.gospelChapter }
    else if (activeReading === 'psalm') { book = 'Psalms'; chapter = reading.psalmChapter }
    else if (activeReading === 'wisdom') { book = reading.wisdomBook; chapter = reading.wisdomChapter }
    await supabase.from('scripture_videos').insert([{ book, chapter, video_url: newVideoUrl.trim(), title: newVideoTitle.trim() || 'Video' }])
    setNewVideoUrl('')
    setNewVideoTitle('')
    setShowAddVideo(false)
    loadVideos(book, chapter)
  }

  const getVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  const currentTranslationName = TRANSLATIONS.flatMap(l => l.versions).find(v => v.code === selectedTranslation)?.name || selectedTranslation

  const renderVerses = () => {
    if (!bibleText) return null
    const blocks = []
    const isPsalm = activeReading === 'psalm'

    if (isPsalm) {
      if (psalmMeta.bookHeader) {
        blocks.push(
          <p key="book-header" style={{
            fontSize: '24px', fontWeight: '700',
            color: '#333333', marginBottom: '4px',
            fontFamily: 'Garamond, Georgia, serif',
            textAlign: 'center', letterSpacing: '1px'
          }}>
            {psalmMeta.bookHeader}
          </p>
        )
      }
      if (psalmMeta.superscription) {
        blocks.push(
          <p key="superscription" style={{
            fontSize: '24px', fontWeight: '700', fontStyle: 'italic',
            color: '#555555', marginBottom: '16px', marginTop: '8px',
            fontFamily: 'Garamond, Georgia, serif', textAlign: 'left',
            borderLeft: '3px solid #dc143c', paddingLeft: '12px'
          }}>
            {psalmMeta.superscription}
          </p>
        )
      }
    }

    bibleText.forEach((v, i) => {
      let verseText = ''

      if (selectedTranslation === 'NIV') {
        if (isPsalm && v.verse === 1) {
          const { verseText: vt } = parsePsalmVerse1NIV(v.text || '')
          verseText = cleanVerseText(vt, selectedTranslation)
        } else {
          const { verseText: vt } = extractNIVHeading(v.text || '')
          verseText = cleanVerseText(vt, selectedTranslation)
        }
      } else {
        verseText = cleanVerseText(v.text || '', selectedTranslation)
      }

      const heading = headingMap[v.verse]
      if (heading) {
        blocks.push(
          <p key={`h-${v.verse}`} style={{
            fontSize: '24px', fontWeight: '700', fontStyle: 'italic',
            color: '#1a1a1a', marginBottom: '8px',
            marginTop: i === 0 ? '0' : '24px',
            fontFamily: 'Garamond, Georgia, serif',
            borderBottom: '1px solid #e0e0e0', paddingBottom: '6px'
          }}>
            {heading}
          </p>
        )
      }

      if (verseText) {
        blocks.push(
          <div key={v.verse}>
            <p style={{
              fontSize: '22px', fontWeight: '500', lineHeight: '2',
              color: '#1a1a1a', marginBottom: '4px',
              fontFamily: 'Garamond, Georgia, serif', textAlign: 'left',
              direction: isHebrewSelected ? 'rtl' : 'ltr'
            }}>
              <span style={{ fontSize: '13px', color: '#dc143c', fontWeight: '800', marginRight: '6px', verticalAlign: 'super' }}>
                {v.verse}
              </span>
              {verseText}
            </p>
            {isHebrewSelected && hebrewPhonetics[v.verse] && (
              <p style={{
                fontSize: '16px', fontStyle: 'italic', color: '#666666',
                marginBottom: '12px', marginLeft: '20px',
                fontFamily: 'Garamond, Georgia, serif', textAlign: 'left',
                direction: 'ltr'
              }}>
                {hebrewPhonetics[v.verse]}
              </p>
            )}
          </div>
        )
      }
    })
    return blocks
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #1a6bbd 0%, #4a9fd4 40%, #87ceeb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Garamond, Georgia, serif' }}>
        Loading your reading plan...
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #1a6bbd 0%, #4a9fd4 40%, #87ceeb 100%)', color: 'white', fontFamily: 'Garamond, Georgia, serif', overflow: 'hidden' }}>

      <div style={{ padding: '20px 20px 12px', flexShrink: 0 }}>
        <button onClick={() => setScreen('home')} style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', padding: 0, marginBottom: '12px', display: 'block', fontFamily: 'Garamond, Georgia, serif' }}>
          ← Back to Cross
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.4)', margin: 0, fontFamily: 'Garamond, Georgia, serif' }}>
            📖 Scripture Reading
          </h2>
          <div style={{ background: 'rgba(255,215,0,0.2)', border: '2px solid rgba(255,215,0,0.6)', borderRadius: '20px', padding: '6px 14px' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#ffd700' }}>Day {day}</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <UserInboxBadge user={user} username={username} avatarUrl={avatarUrl} onAvatarChange={onAvatarChange} unreadCount={unreadCount} onOpenInbox={onOpenInbox} compact />
        </div>

        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <button onClick={() => setShowTranslationPicker(!showTranslationPicker)} style={{
            width: '100%', padding: '8px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700',
            background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.3)',
            color: '#ffffff', cursor: 'pointer', fontFamily: 'Garamond, Georgia, serif', textAlign: 'left',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span>📖 {selectedTranslation} — {currentTranslationName}</span>
            <span>{showTranslationPicker ? '▲' : '▼'}</span>
          </button>

          {showTranslationPicker && (
            <div style={{
              position: 'absolute', top: '44px', left: 0, right: 0, zIndex: 100,
              background: '#0d2a4a', border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '12px', padding: '12px', maxHeight: '300px', overflowY: 'auto',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
            }}>
              {TRANSLATIONS.map(lang => (
                <div key={lang.language} style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#ffd700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                    {lang.language}
                  </p>
                  {lang.versions.map(v => (
                    <button key={v.code} onClick={() => { setSelectedTranslation(v.code); setShowTranslationPicker(false) }}
                      style={{
                        width: '100%', padding: '8px 10px', borderRadius: '8px', marginBottom: '4px',
                        background: selectedTranslation === v.code ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)',
                        border: selectedTranslation === v.code ? '1px solid rgba(255,215,0,0.5)' : '1px solid rgba(255,255,255,0.1)',
                        color: selectedTranslation === v.code ? '#ffd700' : '#ffffff',
                        fontWeight: selectedTranslation === v.code ? '700' : '400',
                        cursor: 'pointer', fontFamily: 'Garamond, Georgia, serif', fontSize: '13px', textAlign: 'left'
                      }}>
                      {v.code} — {v.name}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {status && (
          <p style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.3)', padding: '10px', borderRadius: '10px', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>{status}</p>
        )}

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { key: 'gospel', label: `📘 ${reading.gospelBook} ${reading.gospelChapter}` },
            { key: 'psalm', label: `🎵 Psalm ${reading.psalmChapter}` },
            { key: 'wisdom', label: reading.wisdomBook ? `📜 ${reading.wisdomBook} ${reading.wisdomChapter}` : '🌟 Prophecy' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveReading(tab.key)} style={{
              padding: '8px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
              background: activeReading === tab.key ? '#ffd700' : 'rgba(0,0,0,0.2)',
              color: activeReading === tab.key ? '#0d2a4a' : '#ffffff',
              border: activeReading === tab.key ? 'none' : '1px solid rgba(255,255,255,0.3)',
              fontFamily: 'Garamond, Georgia, serif'
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 32px' }}>

        {activeReading === 'wisdom' && reading.wisdomRef && (
          <div style={{ background: 'rgba(255,215,0,0.1)', border: '2px solid rgba(255,215,0,0.4)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
            <p style={{ fontSize: '17px', fontWeight: '700', color: '#ffd700', marginBottom: '8px', fontFamily: 'Garamond, Georgia, serif' }}>🌟 Messianic Prophecy Series</p>
            <p style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '6px', fontFamily: 'Garamond, Georgia, serif' }}>{reading.wisdomRef.reference}</p>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', fontFamily: 'Garamond, Georgia, serif' }}>{reading.wisdomRef.description}</p>
          </div>
        )}

        {hebrewNTWarning && (
          <div style={{ background: 'rgba(220,20,60,0.15)', border: '2px solid rgba(220,20,60,0.4)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#ff9999', marginBottom: '6px', fontFamily: 'Garamond, Georgia, serif' }}>⚠️ Hebrew Old Testament Only</p>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontFamily: 'Garamond, Georgia, serif' }}>
              The Hebrew translations contain only the Old Testament. {currentBook} is not available in Hebrew. Please switch to another translation or select the Psalm or Wisdom reading.
            </p>
          </div>
        )}

        {bibleLoading && (
          <div style={{ textAlign: 'center', padding: '32px', color: 'rgba(255,255,255,0.7)', fontSize: '16px', fontFamily: 'Garamond, Georgia, serif' }}>
            Loading scripture...
          </div>
        )}

        {bibleText && !hebrewNTWarning && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '15px', fontWeight: '700', color: '#ffd700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Garamond, Georgia, serif' }}>
              {activeReading === 'gospel' ? `${reading.gospelBook} ${reading.gospelChapter}` :
               activeReading === 'psalm' ? `Psalm ${reading.psalmChapter}` :
               `${reading.wisdomBook} ${reading.wisdomChapter}`} — {selectedTranslation}
            </p>
            <div style={{
              background: '#ffffff', borderRadius: '12px', padding: '24px',
              height: '340px', overflowY: 'auto',
              border: '2px solid rgba(255,215,0,0.4)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              textAlign: 'left'
            }}>
              {renderVerses()}
            </div>
          </div>
        )}

        {!hebrewNTWarning && (
          <div style={{ marginBottom: '16px' }}>
            <button onClick={getCommentary} disabled={commentaryLoading} style={{
              width: '100%', padding: '13px', borderRadius: '10px',
              background: 'rgba(255,215,0,0.15)', border: '2px solid rgba(255,215,0,0.5)',
              color: '#ffd700', fontWeight: '700', cursor: 'pointer',
              fontFamily: 'Garamond, Georgia, serif', fontSize: '15px'
            }}>
              {commentaryLoading ? '⏳ Generating commentary...' : '✨ Get AI Commentary'}
            </button>

            {commentary && (
              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', marginTop: '10px', border: '2px solid rgba(255,215,0,0.4)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', textAlign: 'left' }}>
                <p style={{ fontSize: '14px', fontWeight: '800', color: '#dc143c', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Garamond, Georgia, serif' }}>✨ AI Commentary</p>
                <p style={{ fontSize: '19px', fontWeight: '500', lineHeight: '1.9', color: '#1a1a1a', whiteSpace: 'pre-wrap', fontFamily: 'Garamond, Georgia, serif', textAlign: 'left' }}>{commentary}</p>
              </div>
            )}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', margin: 0, fontFamily: 'Garamond, Georgia, serif' }}>🎥 Videos</p>
            <button onClick={() => setShowAddVideo(!showAddVideo)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: '#ffffff', borderRadius: '20px', padding: '5px 14px', fontSize: '13px', cursor: 'pointer', fontFamily: 'Garamond, Georgia, serif' }}>+ Add Video</button>
          </div>

          {showAddVideo && (
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <input value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} placeholder="Video title (optional)"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.2)', color: '#ffffff', fontSize: '14px', outline: 'none', fontFamily: 'Garamond, Georgia, serif', boxSizing: 'border-box', marginBottom: '8px' }} />
              <input value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} placeholder="YouTube URL"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.2)', color: '#ffffff', fontSize: '14px', outline: 'none', fontFamily: 'Garamond, Georgia, serif', boxSizing: 'border-box', marginBottom: '8px' }} />
              <button onClick={addVideo} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1a1916', color: '#ffffff', fontWeight: 'bold', cursor: 'pointer', border: 'none', fontFamily: 'Garamond, Georgia, serif', fontSize: '14px' }}>Save Video</button>
            </div>
          )}

          {videos.length === 0 && !showAddVideo && (
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', fontFamily: 'Garamond, Georgia, serif' }}>No videos added yet for this chapter.</p>
          )}

          {videos.map(v => {
            const videoId = getVideoId(v.video_url)
            return (
              <div key={v.id} style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#ffd700', marginBottom: '6px', fontFamily: 'Garamond, Georgia, serif' }}>{v.title}</p>
                {videoId ? (
                  <iframe width="100%" height="200" src={`https://www.youtube.com/embed/${videoId}`} style={{ borderRadius: '10px', border: 'none' }} allowFullScreen />
                ) : (
                  <a href={v.video_url} target="_blank" rel="noreferrer" style={{ color: '#7ab8ff', fontSize: '14px', fontFamily: 'Garamond, Georgia, serif' }}>{v.video_url}</a>
                )}
              </div>
            )
          })}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginBottom: '8px', fontFamily: 'Garamond, Georgia, serif' }}>
            💭 What did you learn from this reading?
          </p>
          {savedReflection && (
            <div style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: '10px', padding: '14px', marginBottom: '10px' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#ffd700', marginBottom: '6px', fontFamily: 'Garamond, Georgia, serif' }}>Your reflection:</p>
              <p style={{ fontSize: '17px', color: '#ffffff', lineHeight: '1.7', fontFamily: 'Garamond, Georgia, serif' }}>{savedReflection}</p>
            </div>
          )}
          <textarea value={reflection} onChange={e => setReflection(e.target.value)}
            placeholder="Write your thoughts, insights, or what spoke to you today..."
            rows={4}
            style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.2)', color: '#ffffff', fontSize: '16px', outline: 'none', fontFamily: 'Garamond, Georgia, serif', boxSizing: 'border-box', resize: 'vertical', lineHeight: '1.7' }}
          />
          <button onClick={saveReflection} disabled={savingReflection} style={{ marginTop: '8px', width: '100%', padding: '13px', borderRadius: '10px', background: '#1a1916', color: '#ffffff', fontWeight: 'bold', cursor: 'pointer', border: 'none', fontFamily: 'Garamond, Georgia, serif', fontSize: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
            {savingReflection ? 'Saving...' : 'Save Reflection'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          {day > 1 && (
            <button onClick={() => setDay(day - 1)} style={{
              flex: 1, padding: '15px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.1)', color: '#ffffff',
              fontWeight: '700', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.3)',
              fontFamily: 'Garamond, Georgia, serif', fontSize: '15px'
            }}>← Day {day - 1}</button>
          )}
          <button onClick={markAsRead} style={{ flex: 2, padding: '15px', borderRadius: '10px', background: 'linear-gradient(135deg, #ffd700, #ffb300)', color: '#0d2a4a', fontWeight: '700', cursor: 'pointer', border: 'none', fontFamily: 'Garamond, Georgia, serif', fontSize: '17px', boxShadow: '0 4px 16px rgba(255,215,0,0.4)', letterSpacing: '0.5px' }}>
          ✅ Mark Day {day} as Complete
          </button>
        </div>

      </div>
    </div>
  )
}