export const readCounter = (wordCount: number | undefined = 0, wordsPerMinute: number = 500): number => {
    const readingTime = wordCount / wordsPerMinute;
    return Math.ceil(readingTime);
}