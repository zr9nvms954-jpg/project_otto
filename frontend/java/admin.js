/*
    =========================================================
    AUTO-NEXUS
    CUSTOMER ACCOUNT JAVASCRIPT

    Giữ nguyên file:
    /frontend/java/admin.js

    Không có dữ liệu khách hàng giả.
    Không gọi API.
    Backend có thể tích hợp sau.
    =========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    function () {
        initAccountTabs();
        initProfileForm();
        initPasswordForm();
        initNotification();
        initCurrentYear();

    }
);
/* =========================================================
   ACCOUNT TABS
   ========================================================= */

function initAccountTabs() {

    const sidebarItems =
        document.querySelectorAll(
            ".sidebar-item"
        );

    const accountPanels =
        document.querySelectorAll(
            ".account-panel"
        );

    if (
        sidebarItems.length === 0 ||
        accountPanels.length === 0
    ) {

        return;

    }

    sidebarItems.forEach(
        function (item) {

            item.addEventListener(
                "click",
                function () {

                    const target =
                        item.dataset.target;


                    /*
                        ACTIVE SIDEBAR
                    */

                    sidebarItems.forEach(
                        function (menuItem) {

                            menuItem.classList.remove(
                                "active"
                            );

                        }
                    );


                    item.classList.add(
                        "active"
                    );


                    /*
                        SHOW PANEL
                    */

                    accountPanels.forEach(
                        function (panel) {

                            panel.classList.remove(
                                "active"
                            );

                            if (
                                panel.dataset.panel ===
                                target
                            ) {

                                panel.classList.add(
                                    "active"
                                );

                            }

                        }
                    );

                }
            );

        }
    );

}
/* =========================================================
   PROFILE FORM
   ========================================================= */

function initProfileForm() {

    const form =
        document.getElementById(
            "profileForm"
        );


    if (!form) {

        return;

    }
    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /*
                BACKEND SAU NÀY:

                const formData =
                    new FormData(form);

                fetch(...)

            */

            showToast(
                "Thông tin đã sẵn sàng để kết nối backend."
            );

        }
    );

}
/* =========================================================
   PASSWORD FORM
   ========================================================= */

function initPasswordForm() {

    const form =
        document.getElementById(
            "passwordForm"
        );


    if (!form) {

        return;

    }
    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const currentPassword =
                document.getElementById(
                    "currentPassword"
                );


            const newPassword =
                document.getElementById(
                    "newPassword"
                );


            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                );


            if (
                !currentPassword ||
                !newPassword ||
                !confirmPassword
            ) {

                return;

            }


            if (
                newPassword.value !==
                confirmPassword.value
            ) {

                showToast(
                    "Mật khẩu xác nhận không trùng khớp."
                );

                return;

            }
            /*
                BACKEND SAU NÀY:

                Gửi dữ liệu lên API đổi mật khẩu.

            */

            showToast(
                "Form đổi mật khẩu đã sẵn sàng để kết nối backend."
            );

        }
    );

}

/* =========================================================
   NOTIFICATION
   ========================================================= */

function initNotification() {

    const button =
        document.getElementById(
            "notificationButton"
        );

    if (!button) {

        return;

    }

    button.addEventListener(
        "click",
        function () {

            /*
                BACKEND SAU NÀY:
                Lấy notification của khách hàng.
            */

            showToast(
                "Thông báo sẽ được backend cung cấp sau."
            );

        }
    );

}

/* =========================================================
   CURRENT YEAR
   ========================================================= */

function initCurrentYear() {

    const year =
        document.getElementById(
            "currentYear"
        );


    if (!year) {

        return;

    }
    year.textContent =
        new Date().getFullYear();

}
/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {

        return;

    }

    toast.textContent =
        message;

    toast.classList.remove(
        "hidden"
    );

    clearTimeout(
        showToast.timer
    );

    showToast.timer =
        setTimeout(
            function () {

                toast.classList.add(
                    "hidden"
                );

            },
            2500
        );
}