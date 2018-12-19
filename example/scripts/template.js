$$('#template-target').loadTemplate('a', {
    title: 'Hello World',
    content: 'Good Bye!',
})

$$('#template-target1').loadTemplate('/t1/t1', {
    title: 'Hello World',
    content: 'Good Bye!',
})

$$('#template-target2').loadTemplate('/t2/t2', {
    list: [{
            title: 'Hello World',
            content: 'Good Bye!',
        },
        {
            title: 'Hello World * 2',
            content: 'Good Bye! * 10',
        },
    ],
})
