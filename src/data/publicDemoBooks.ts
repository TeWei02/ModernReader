import type { Book } from '@/types/book'

export type DemoBookInput = Omit<Book, 'id' | 'addedAt'>

// Public-domain / public-reference demo texts for first-run experience.
export const PUBLIC_DEMO_BOOKS: DemoBookInput[] = [
    {
        title: 'Alice in Wonderland (Public Domain Excerpt)',
        authors: ['Lewis Carroll'],
        tags: ['demo', 'public-domain', 'literature', 'english'],
        format: 'markdown',
        source: 'library',
        readingProgress: 0,
        totalWords: 620,
        metadata: {
            language: 'en',
            publishedDate: '1865',
            description:
                'Public domain excerpt for ModernReader demo. Source tradition: classic literature.',
        },
        content: `# Alice in Wonderland (Demo Excerpt)\n\nAlice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do. Once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it.\n\n"And what is the use of a book," thought Alice, "without pictures or conversations?"\n\nSo she was considering in her own mind whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.\n\nThere was nothing very remarkable in that. Nor did Alice think it so very much out of the way to hear the Rabbit say to itself, "Oh dear! Oh dear! I shall be late!"\n\nBut when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet.\n\nShe ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.\n\nIn another moment down went Alice after it, never once considering how in the world she was to get out again.\n\n---\n\n## Demo Tasks\n\n- Try selecting text and creating a highlight.\n- Ask the AI panel to summarize this chapter.\n- Add a note and bookmark, then open Notebook to review them.\n`,
    },
    {
        title: 'The Constitution of the United States (Public Domain Excerpt)',
        authors: ['United States Constitutional Convention'],
        tags: ['demo', 'public-document', 'civics'],
        format: 'markdown',
        source: 'library',
        readingProgress: 0,
        totalWords: 540,
        metadata: {
            language: 'en',
            publishedDate: '1787',
            description:
                'Public domain governmental text excerpt for legal/civic reading demo.',
        },
        content: `# U.S. Constitution (Demo Excerpt)\n\n## Preamble\n\nWe the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defence, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America.\n\n## Article I, Section 1\n\nAll legislative Powers herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives.\n\n## Article II, Section 1 (Excerpt)\n\nThe executive Power shall be vested in a President of the United States of America. He shall hold his Office during the Term of four Years...\n\n## Article III, Section 1 (Excerpt)\n\nThe judicial Power of the United States, shall be vested in one supreme Court, and in such inferior Courts as the Congress may from time to time ordain and establish...\n\n---\n\n## Demo Tasks\n\n- Highlight one sentence from each branch (legislative, executive, judicial).\n- Create a flashcard from one highlighted sentence.\n`,
    },
    {
        title: '孫子兵法（公版節錄，繁中）',
        authors: ['孫武'],
        tags: ['demo', 'public-domain', 'chinese', 'strategy'],
        format: 'markdown',
        source: 'library',
        readingProgress: 0,
        totalWords: 420,
        metadata: {
            language: 'zh-TW',
            publishedDate: '古代文獻',
            description: '公版古籍節錄，作為繁體中文閱讀與註記示範資料。',
        },
        content: `# 孫子兵法（示範節錄）\n\n孫子曰：兵者，國之大事，死生之地，存亡之道，不可不察也。\n\n故經之以五事，校之以計，而索其情：一曰道，二曰天，三曰地，四曰將，五曰法。\n\n道者，令民與上同意也，可與之死，可與之生，而不危也。\n\n天者，陰陽、寒暑、時制也。\n\n地者，遠近、險易、廣狹、死生也。\n\n將者，智、信、仁、勇、嚴也。\n\n法者，曲制、官道、主用也。\n\n故校之以計而索其情，曰：主孰有道？將孰有能？天地孰得？法令孰行？\n\n---\n\n## Demo Tasks\n\n- 試著用 AI Companion 做段落摘要。\n- 將「道、天、地、將、法」做成 5 張記憶卡。\n`,
    },
]
