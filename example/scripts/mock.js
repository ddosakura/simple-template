$$.mock = true
$$.mockAPI['^/debug$'] = {
    // method: 'POST',
    response: (req) => req
}
$$.ajax({
    url: '/404',
    success: (res) => {
        console.log(res)
    }
})
const t = $$.ajax({
    url: '/debug?a=1&b=2',
    data: {
        b: 3,
        c: 4,
    },
    success: (res) => {
        console.log(res)
    }
})
t.abort()
$$.ajax({
    url: '/debug',
    data: {
        b: 3,
        c: 4,
    },
    success: (res) => {
        console.log(res)
    }
})