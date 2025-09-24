document.addEventListener('DOMContentLoaded', () => {
    const open_sidebar = document.getElementById('icon-sidebar')

    open_sidebar.addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        const sidebar_wrap = document.querySelector('.sidebar__wrap');

        const close = document.getElementById('close')

        close.addEventListener('click', () => {
            document.body.style.overflow = 'auto';
            document.body.style.height = 'auto';
            sidebar.style.transform = 'translateX(100%)';
            sidebar_wrap.style.opacity = '0';
            setTimeout(() => {
                sidebar_wrap.style.zIndex = '-110';
                sidebar.style.zIndex = '-112';
            }, 300)

        })

        sidebar_wrap.addEventListener('click', (e) => {
            document.body.style.overflow = 'auto';
            document.body.style.height = 'auto';
            sidebar.style.transform = 'translateX(100%)';
            sidebar_wrap.style.opacity = '0';
            setTimeout(() => {
                sidebar_wrap.style.zIndex = '-110';
                sidebar.style.zIndex = '-112';
            }, 300)

        })


        document.body.style.overflow = 'hidden';
        document.body.style.height = '100dvh';
        sidebar.style.transform = 'translateX(0)';
        sidebar.style.zIndex = '112';
        sidebar_wrap.style.opacity = '1';
        sidebar_wrap.style.zIndex = '110';
    })
})