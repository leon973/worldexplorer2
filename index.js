
$(document).ready(function() {
  
    const $popup = $('.popup');
    const $acceptBtn = $('#Accept');
    const $declineBtn = $('#Decline');
  
    // if the record exist it will not record again
    const cookieConsentCheck = getCookie('cookieConsent') || localStorage.getItem('cookieConsent');
    if (!cookieConsentCheck) {
        $popup.show();
    }
  
    // When user accepts cookies
    $acceptBtn.click(function() {
       //store it on cookie 
        setCookie('cookieConsent', 'accepted', 365); 

        localStorage.setItem('cookieConsent', 'accepted');
       
        $popup.hide();
    });
  
    // When user declines cookies
    $declineBtn.click(function() {
        setCookie('cookieConsent', 'declined', 365);
        localStorage.setItem('cookieConsent', 'declined');
        $popup.hide();
    });
  
    // set cookie function
    function setCookie(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";  
    }
  
    //  get cookie function
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
  
    // Function to delete a cookie
    function eraseCookie(name) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  
    // Subscribe form handling with jQuery
    $('#subscribeForm').submit(function(event) {
        event.preventDefault(); // Prevent the form from submitting normally
  
        // Get the email value
        const email = $('#emailInput').val();
  
        // Store the email in local storage
        localStorage.setItem('userEmail', email);
  
        // Store the email in session storage
        sessionStorage.setItem('userEmail', email);
  
        // Store the email in cookies
        setCookie('userEmail', email, 30); 
        
        // Show alert message
        alert('Thank you for subscribing! Your email has been saved.');
  
        // Disable the input field and change the button text and color
        $('#emailInput').prop('disabled', true);
        const $subscribeButton = $('#subscribeForm button');
        $subscribeButton.text('Subscribed');
        $subscribeButton.addClass('subscribed');
    });
  
    // Storage management functions
    function updateStorageDisplays() {
        // Update local storage display if exists
        if ($('#localStorageDisplay').length) {
            const localStorageItems = { ...localStorage };
            $('#localStorageDisplay').text(JSON.stringify(localStorageItems, null, 2));
        }
        
        // Update session storage display if exists
        if ($('#sessionStorageDisplay').length) {
            const sessionStorageItems = { ...sessionStorage };
            $('#sessionStorageDisplay').text(JSON.stringify(sessionStorageItems, null, 2));
        }
        
        // Update cookie display if exists
        if ($('#cookieDisplay').length) {
            $('#cookieDisplay').text(document.cookie);
        }
    }
  
    // Add storage display update if elements exist
    if ($('#localStorageDisplay, #sessionStorageDisplay, #cookieDisplay').length) {
        updateStorageDisplays();
        
        // Add refresh button functionality
        $('#refreshStorage').click(function() {
            updateStorageDisplays();
        });
    }
  
    //  click explore country to go to the sub page
    $('.explore-btn').click(function() {
        const country = $(this).closest('.country-card').find('.country-name').text();
        
        // Store in session storage (for the current browsing session)
        sessionStorage.setItem('lastViewedCountry', country);
        
      
        let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        // Remove if already exists
        recentlyViewed = recentlyViewed.filter(item => item !== country);
        // Add to beginning of array
        recentlyViewed.unshift(country);
        // Keep only the 5 most recent
        recentlyViewed = recentlyViewed.slice(0, 5);
        localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
        
        // Navigate to the respective page
        // Convert country name to lowercase for URL
        const countryLower = country.toLowerCase().replace(/\s+/g, '');
        window.location.href = countryLower + ".html";
    });
  
    // Track page views with session storage
    function trackPageViews() {
        let sessionVisitCount = parseInt(sessionStorage.getItem('sessionVisitCount') || '0');
        sessionVisitCount++;
        sessionStorage.setItem('sessionVisitCount', sessionVisitCount.toString());
        
        // If you have a display element for this
        if ($('#sessionVisits').length) {
            $('#sessionVisits').text(sessionVisitCount);
        }
        
        // Store last visit timestamp in localStorage
        localStorage.setItem('lastVisit', new Date().toISOString());
        
        // Track user's path through site in session storage
        let sessionPath = JSON.parse(sessionStorage.getItem('sessionPath')) || [];
        sessionPath.push({
            page: window.location.pathname,
            time: new Date().toISOString()
        });
        sessionStorage.setItem('sessionPath', JSON.stringify(sessionPath));
    }
    
  });