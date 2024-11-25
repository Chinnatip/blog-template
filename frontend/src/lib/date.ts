import dayjs from "dayjs"

export const date_format = (date: Date) => {
    return  new Date(date).toLocaleString('en-GB', {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    })
}


export const date_is = (date: Date) => {
    return  dayjs(date).format('MMM DD')
}