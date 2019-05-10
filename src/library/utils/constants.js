module.exports = {
    requestResult: {
        failure: 0,
        success: 1,
    },
    ms_per_day: 5,

    saltRound: 12,
    userRanking: {
        bronze: 0,
        silver: 1,
        gold: 2,
    },
    request_status: {
        pending: 1,
        accepted: 2,
        rejected: 3,
        finished: 4,
    },
    gender: {
        no_data: 0,
        male: 1,
        female: 2,
    },
    book_status: {
        available: 1,
        unavailable: 2,
        pending: 0,
    },
    book_category: {
        programming: '0',
        detective: '1',
        science: '2',
        programming: '3',
        self_help: '4',
        travel: '5',
        romance: '6',
        other: '',
    },
    request_type: {
        borrow: 1,
        contribute: 2,
    },

    //count by days
    borrow_limit: {
        bronze: 7,
        silver: 10,
        gold: 15,
    },

    //count by point
    penalty_point: {
        less_than_one: 10,
        less_than_two: 20,
        less_than_three: 30,
        over_than_three: 100,
    },

    bonus_point: {
        per_book: 100,
    }
}