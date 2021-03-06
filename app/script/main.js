(function () {
  /** General variables **/
  const $window = $(window),
        $bodyHtml = $('body, html'),
        $body = $('body'),
        $header = $('header'),
        $upButton = $('.up-btn'),
        $logo = $('.logo'),
        $mobBurger = $('.mob-burger'),
        $mobMenuAuthLink = $('.mob-menu-auth-link'),
        $deskMenuAuthLink = $('.desk-menu-auth-link'),
        $authBlockCloseBtn = $('.auth-block-close-btn'),
        $headerMob = $('.header-mob'),
        $headerDesk = $('.header-desk'),
        $authBlock = $('.auth-block'),
        $menuItem = $('.menu a'),
        $startSectionButton = $('.start-section-greating button'), // Should be removed later
        $location = $('#location'),
        $duration = $('.duration input'),
        $persons = $('.persons input'),
        $searchHotelField = $('.search-form input[type="text"]'),
        $searchHotelBtn = $('.search-form input[type="submit"]'),
        $sendFormErrorTip = $('.send-form-tooltip'),
        $statusLineItem = $('.status-line-item'),
        $statusLineContentItem = $('.status-line-content .desc-txt'),
        $statusSectionButton = $('.status-section button'), // Should be removed later
        $bookNowBlockButton = $('.book-now-block button'), // Should be removed later
        $blogBtn = $('.blog-btn'),
        $tourBookSectionButton = $('.tour-book-section button'), // Should be removed later
        $customerSliderWrap = $('.slider-wrap'),
        searchLocationReg = /(^([a-zA-Z]+[ '-][a-zA-Z]+[ '-][a-zA-Z]+$)|^([a-zA-Z]+[ '-][a-zA-Z]+$)|^[a-zA-Z]+$)/gm,
        searchDateReg = /^\d{2}[ \/\.-]\d{2}[ \/\.-]\d{4}/gm,
        searchPersonReg = /^\d+$/gm;

  var searchHotelObj = {
        location: '',
        checkIn: '',
        checkOut: '',
        adults: '',
        child: ''
      };

  /** Detect mobile or desktop screen width **/
  $window.on('load resize orientationchange', function () {
    var windowWidth = $window.width();

    if (windowWidth >= 1024) {
      $body.removeClass('mobile');
      $body.addClass('desktop');
    }
    else {
      $body.removeClass('desktop');
      $body.addClass('mobile');
    }
  });

  /** Scroll top by logo click **/
  $logo.on('click', function () {
    $bodyHtml.stop().animate({scrollTop:0}, 1000);
  });

  /** Header mobile burger menu **/
  $mobBurger.on('click', function () {
    // Close authorization submenu
    if ($header.hasClass('open-submenu')) {
      $header.removeClass('open-submenu');
      $authBlock.removeClass('sign-in-tab sign-up-tab');
    }
    // Close main menu
    else {
      $body.toggleClass('no-scroll blur');
      $header.toggleClass('open-menu');
    }
  });

  /** Hide burger menu on resize/change orientation **/
  // Hide mobile menu function
  function hideMobileMenu() {
    $body.removeClass('no-scroll blur');
    $header.removeClass('open-menu open-submenu');
    $authBlock.removeClass('sign-in-tab sign-up-tab');
  }

  $window.on('resize orientationchange', function () {
    hideMobileMenu();
  });

  /** Hide/show authorization submenu **/
  // Choose authorization form function
  function chooseAuthForm(param) {
    var dataClass = param.attr('data-class');

    $authBlock.addClass(dataClass);
  }

  // Open mobile authorization submenu
  $mobMenuAuthLink.on('click', function () {
    $header.addClass('open-submenu');

    chooseAuthForm($(this));
  });

  // Toggle mobile authorization menu
  $('li', $authBlock).on('click', function () {
    $authBlock.removeClass('sign-in-tab sign-up-tab');

    chooseAuthForm($(this));
  });

  // Open desktop authorization submenu
  $deskMenuAuthLink.on('click', function () {
    $body.addClass('no-scroll blur');
    $header.addClass('open-submenu');

    chooseAuthForm($(this));
  });

  // Hide desktop authorization submenu
  $authBlockCloseBtn.on('click', function () {
    hideMobileMenu();
  });

  /** Sticky desktop header **/
  $window.on('load scroll', function () {
    if ($body.hasClass('desktop')) {
      ($window.scrollTop() > 200) ? $headerDesk.addClass('sticky') : $headerDesk.removeClass('sticky');
      }
  });

  /** Anchor link **/
  $menuItem.on('click', function (e) {
    e.preventDefault();

    var anchorAttr = $(this).attr('data-anchor'),
        $anchorElem = $('#' + anchorAttr),
        anchorElemTop = $anchorElem.offset().top;

    if ($body.hasClass('mobile')) {
      var headerMobHeight = $headerMob.innerHeight();

      hideMobileMenu();

      $bodyHtml.stop().animate({scrollTop:anchorElemTop - headerMobHeight}, 1000);
    }
    else {
      var headerDeskHeight = $headerDesk.innerHeight();

      $bodyHtml.stop().animate({scrollTop:anchorElemTop - headerDeskHeight}, 1000);
    }
  });

  /** Main banner action button **/ // Should be removed later
  $startSectionButton.on('click', function (e) {
    e.preventDefault();

    alert('e.g. Should be redirect to the main site main page');
  });

  /** Search form validation **/
  // Location validation
  $location.on('blur', function () {

    // Remove useless spaces
    $(this).val($(this).val().trim());

    // Match value with RegEx
    var destination = $(this).val().match(searchLocationReg);

    // Set location to object
    if(destination) {
      $(this).removeClass('incorrect');
      searchHotelObj.location = destination[0];
    }
    // Leave empty location value
    else if ($(this).val().length === 0) {
      $(this).removeClass('incorrect');
      searchHotelObj.location = '';
    }
    // Incorrect location value
    else {
      $(this).addClass('incorrect');
    }
  });

  // Date validation
  // Validation date function with parameter
  function correctData(inputDateParam) {
    var splitDurationDate = inputDateParam.split('.'),
        inputYear = parseInt(splitDurationDate[2]),
        inputMonth = parseInt(splitDurationDate[1]),
        inputDay = parseInt(splitDurationDate[0]),
        formattedData = new Date(splitDurationDate[2], splitDurationDate[1] - 1, splitDurationDate[0]);

    if (!(formattedData.getFullYear() === inputYear && formattedData.getMonth() + 1 === inputMonth && formattedData.getDate() === inputDay)) {
      return false;
    }
  }

  // Validate date on blur
  $duration.on('blur', function () {
    // Remove useless spaces
    $(this).val($(this).val().trim());

    // Match value with RegEx
    var durationDate = $(this).val().match(searchDateReg),
        thisId = $(this).attr('id');

    // If date is correct
    if(durationDate) {
      $(this).removeClass('incorrect');

      // Execute validate function with needed parameter
      correctData(durationDate[0]);

      // If check-in field
      if (thisId === 'check-in') {
        (correctData(durationDate[0]) === false) ? $(this).addClass('incorrect') : searchHotelObj.checkIn = durationDate[0];
      }
      // If check-out field
      else {
        (correctData(durationDate[0]) === false) ? $(this).addClass('incorrect') : searchHotelObj.checkOut = durationDate[0];
      }
    }
    // Leave empty check-in or check-out value
    else if ($(this).val().length === 0) {
      $(this).removeClass('incorrect');
      (thisId === 'check-in') ? searchHotelObj.checkIn = '' : searchHotelObj.checkOut = '';
    }
    // If date is incorrect
    else {
      $(this).addClass('incorrect');
    }
  });

  // Persons amount validation
  $persons.on('blur', function () {
    // Remove useless spaces
    $(this).val($(this).val().trim());

    // Match value with RegEx
    var persons = $(this).val().match(searchPersonReg),
        thisId = $(this).attr('id');

    // Set adults or child to object
    if(persons) {
      $(this).removeClass('incorrect');
      (thisId === 'adult') ? searchHotelObj.adults = persons[0] : searchHotelObj.child = persons[0];
    }
    // Leave empty adults or child value
    else if ($(this).val().length === 0) {
      $(this).removeClass('incorrect');
      (thisId === 'adult') ? searchHotelObj.adults = '' : searchHotelObj.child = '';
    }
    // Incorrect persons value
    else {
      $(this).addClass('incorrect');
    }
  });

  // Send search hotels form
  $searchHotelBtn.on('click', function (e) {
    e.preventDefault();

    // All fields are filled correctly
    if (!$searchHotelField.hasClass('incorrect')) {
      $.ajax({
        // type: "POST",
        // url: "url",
        dataType: 'json',
        data: JSON.stringify(searchHotelObj),
        // success: window.open('http://google.com', '_blank') // Should be link to the main site
        success: alert('The main site should be opened with the search result')
      });
    }
    // Show error tip if some fields are filled incorrectly
    else {
      if (!$sendFormErrorTip.hasClass('show-error')) {
        $sendFormErrorTip.addClass('show-error').fadeIn(0);

        setTimeout(function () {
          $sendFormErrorTip.fadeOut(300).removeClass('show-error');
        }, 2000);
      }
    }
  });

  /** Status line tabs **/
  $statusLineItem.on('click', function () {
    if (!$(this).hasClass('active')) {
      var thisId = $(this).attr('id');

      $statusLineItem.removeClass('active');
      $(this).addClass('active');

      $statusLineContentItem.addClass('hide');
      $('.status-line-content .desc-txt[data-id="' + thisId + '"]').removeClass('hide');
    }
  });

  /** Status section action button **/ // Should be removed later
  $statusSectionButton.on('click', function (e) {
    e.preventDefault();

    alert('e.g. Should be redirect to the main site status page');
  });

  /** Best deals action button **/ // Should be removed later
  $bookNowBlockButton.on('click', function (e) {
    e.preventDefault();

    var $bookNowBlockButtonParrent = $(this).closest('.book-now-block'),
        $bookNowBlockButtonPrice = $('.deal-price', $bookNowBlockButtonParrent).text();

    alert('e.g. Should be redirect to the main site book page for ' + $bookNowBlockButtonPrice + ' price');
  });

  /** Show blog popup **/
  $blogBtn.on('click', function () {
    var $blogBtnParent = $(this).closest('.grid-item'),
        thisBlogImgSrc = $('img', $blogBtnParent).attr('src'),
        thisBlogTitleText = $('.blog-title', $blogBtnParent).html(),
        blogDataContent = $('.desc-txt', $blogBtnParent).attr('data-content'),
        $popupBlogElem = '<div class="popup-blog-content-wrap">' +
                        '<div class="popup-blog-content">' +
                        '<div class="close-blog-popup">close</div>' +
                        '<p class="popup-blog-title">' + thisBlogTitleText + '</p>' +
                        '<img src="' + thisBlogImgSrc + '">' +
                        '<p class="popup-blog-text">' + blogDataContent + '' +
                        '<span class="fake-end">fake end</span>' +
                        '</p>' +
                        '<button>read more</button>' +
                        '</div>' +
                        '</div>';

    $body.addClass('no-scroll blog-blur').append($popupBlogElem);

    // Close popup function
    function closeBlogPopup () {
      $('.popup-blog-content-wrap').remove();
      $body.removeClass('no-scroll blog-blur');
    }

    $('.close-blog-popup').on('click', function () {
      closeBlogPopup();
    });

    $(window).on('resize orientationchange', function () {
      closeBlogPopup();
    });

    $('.popup-blog-content button').on('click', function () {
      alert('e.g. Should be redirect to this blog page on the main site');
    })
  });

  /** Another one book action button **/ // Should be removed later
  $tourBookSectionButton.on('click', function (e) {
    e.preventDefault();

    alert('e.g. Should be redirect to the main site another one book page');
  });

  /** Slick plugin **/
  $(document).ready(function () {
    $customerSliderWrap.slick(
      {
        autoplay: true,
        dots: true,
        arrows: false,
        speed: 500,
        autoplaySpeed: 4000
      }
    );
  });

  /** Scroll top button **/
  // Show or hide scrollTop button when scrolling
  $window.on('scroll load', function () {
    ($(this).scrollTop() > 1000) ? $upButton.fadeIn(300) : $upButton.fadeOut(300);
  });

  // Scroll the page top after click
  $upButton.on('click', function () {
    $bodyHtml.stop().animate({scrollTop:0}, 1000);
    return false
  });
})(jQuery);
