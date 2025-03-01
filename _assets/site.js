$(function () {
    // Smooth scrolling for navigation links
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').on("click", function () {
        if (location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") && location.hostname == this.hostname) {
            var a = $(this.hash);
            if ((a = a.length ? a : $("[name=" + this.hash.slice(1) + "]")).length) return $("html, body").animate({
                scrollTop: a.offset().top - 54
            }, 1000, "easeInOutExpo"), false;
        }
    });

    // Collapse navbar when link is clicked
    $(".js-scroll-trigger").on("click", function () {
        $(".navbar-collapse").collapse("hide");
    });

    // Activate scrollspy
    $("body").scrollspy({
        target: "#mainNav",
        offset: 56
    });

    // Navbar shrink on scroll
    $(window).on("scroll", function () {
        if ($("#mainNav").offset().top > 100) {
            $("#mainNav").addClass("navbar-shrink");
        } else {
            $("#mainNav").removeClass("navbar-shrink");
        }
    });

    // Back to Top Button Logic
    var backToTop = $("#back-to-top"),
        progressCircle = $(".progress-ring__circle"),
        radius = progressCircle.attr("r"),
        circumference = 2 * Math.PI * radius;

    progressCircle.css({
        strokeDasharray: circumference,
        strokeDashoffset: circumference
    });

    function updateProgress() {
        var scrollTop = $(window).scrollTop(),
            docHeight = $(document).height() - $(window).height(),
            progress = scrollTop / docHeight,
            dashOffset = circumference * (1 - progress);

        progressCircle.css("stroke-dashoffset", dashOffset);
    }

    function toggleBackToTop() {
        if ($(window).scrollTop() > $(document).height() * 0.3) {
            backToTop.fadeIn();
        } else {
            backToTop.fadeOut();
        }
    }

    $(window).on("scroll", function () {
        toggleBackToTop();
        updateProgress();
    });

    backToTop.on("click", function () {
        $("html, body").animate({ scrollTop: 0 }, 800, "easeInOutExpo");
    });

});
