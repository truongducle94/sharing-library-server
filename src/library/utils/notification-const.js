module.exports = {
    NOTIFY_TYPE: {
        REQUEST: 1,
        REMIND: 2,
        POINT: 3,
        RANK_CHANGE: 4,
    },

    NOTIFY_HEADING: {
        REQUEST: 'Yêu cầu',
        POINT: 'Điểm thưởng',
        REMIND: 'Nhắc nhở',
        RANK_CHANGE: 'Thẻ thành viên',
        BORROW_BOOK: 'Mượn sách',
        CONTRIBUTE_BOOK: 'Đóng góp sách',
        RETURN_BOOK: 'Trả sách',
    },

    NOTIFY_CONTENT: {
        REQUEST_BORROW_SENDING: 'Yêu cầu mượn sách đã được gửi',
        REQUEST_BORROW_CONFIRM: 'Bạn đã mượn sách thành công',
        REQUEST_CONTRIBUTE_SENDING: 'Bạn vừa gửi yêu cầu đăng ký đóng góp sách',
        REQUEST_CONTRIBUTE_CONFIRM: 'Bạn vừa đóng góp sách cho thư viện. Xin cảm ơn!',
        REQUEST_CANCEL: 'Yêu cầu đã được hủy',
        RETURN_BOOK: 'Đã trả sách. Cảm ơn bạn đã sử dụng thư viện',
        POINT_BONUS: (point) => `Bạn vừa được cộng ${point} điểm vào điểm thưởng`,
        POINT_PENALTY: (point) => `Bạn đã bị trừ ${point} điểm thưởng vì trả muộn`,
        RANK_DOWN: (rank) => `Bạn đã bị hạ xuống thành viên ${rank}`,
        RANK_UP: (rank) => `Bạn đã được thăng lên thành viên ${rank}`,
        REMIND: (days) => `Chỉ còn ${days} ngày cho đến hạn trả sách`,
    }
}