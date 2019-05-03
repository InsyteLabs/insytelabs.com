'use strict';

(() => {
    console.log('Hello World!');
    console.log('❤️ Insyte Labs');
    console.log('--------------');
})();

(function() {

    // Elements
    const contactButton = document.querySelector('.contact-button'),
          closeButton   = document.getElementById('close'),
          contactForm   = document.querySelector('form.contact-form'),
          firstName     = contactForm.querySelector('#first-name'),
          lastName      = contactForm.querySelector('#last-name'),
          email         = contactForm.querySelector('#email'),
          message       = contactForm.querySelector('#message'),
          submitButton  = contactForm.querySelector('.submit-button'),
          paneWrapper   = document.querySelector('.pane-wrapper'),
          thankYou      = document.querySelector('.thank-you'),
          errorMessage  = document.querySelector('.error-message');


    contactButton.addEventListener('click', toggleContact);
    closeButton.addEventListener('click', toggleContact);

    contactForm.addEventListener('submit', formSubmit);
    submitButton.addEventListener('click', formSubmit);

    [
        firstName, lastName, email, message
    ].forEach(el => {
        el.addEventListener('change', validateInput);
        el.addEventListener('blur',   validateInput);
    });

    function validateInput(e){
        const { target } = e;

        const validator = target.getAttribute('data-validator');

        if(!validator) return;

        const exp = new RegExp(validator),
              val = target.value;

        if(!exp.test(val)){
            return target.classList.add('error');
        }
        target.classList.remove('error');
    }

    function formSubmit(e){
        e.preventDefault();
        resetErrors();

        const data = getFormValues();

        if(!validateForm(data)) return;

        const url = 'https://api.insytelabs.com/forms/contact';
        // const url = 'http://localhost:8080/forms/contact';

        axios({
            url,
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHTTPRequst'
            },
            responseType: 'json',
            data
        }).then(r => {
            if(r.status === 200){

                const { data, message } = r.data;

                thankYou.querySelector('.first-name').innerText = data.firstName;
                thankYou.querySelector('.last-name').innerText  = data.lastName;
                thankYou.querySelector('.email').innerText      = data.email;
                thankYou.querySelector('.message').innerText    = data.message;

                contactForm.classList.add('hidden');
                thankYou.classList.remove('hidden');

                return;
            }

            throw new Error();
        }).catch(e => {
            contactForm.classList.add('hidden');
            thankYou.classList.add('hidden');
            errorMessage.classList.remove('hidden');
        });
    }

    function validateForm(data){
        let valid = true;
        resetErrors();

        if(!data.firstName){
            valid = false;
            firstName.classList.add('error');
        }
        if(!data.lastName){
            valid = false;
            lastName.classList.add('error');
        }
        if(!data.email){
            valid = false;
            email.classList.add('error');
        }
        else if(!/.*?@.*\..{2,}/.test(data.email)){
            valid = false;
            email.classList.add('error');
        }
        if(!data.message){
            valid = false;
            message.classList.add('error');
        }

        return valid;
    }

    function getFormValues(){
        return {
            firstName: firstName.value,
            lastName:  lastName.value,
            email:     email.value,
            message:   message.value
        }
    }

    function resetErrors(){
        [
            firstName, lastName, email, message
        ].forEach(el => el.classList.remove('error'));
    }

    function toggleContact(){
        try{
            paneWrapper.classList.toggle('contact');
            window.scrollTo(0, 0);
        }
        catch(e){
            alert(e.message);
        }
    }
}());
