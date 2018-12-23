jQuery(function () {

    chrome.storage.sync.get({
        enableSortByMyUpvotes: true,
        enableSortByMyAnswers: true,
        enableHighlightByMyAnswers: true,
    }, function (options) {

        var isDisabled = !options.enableSortByMyUpvotes &&
            !options.enableSortByMyAnswers &&
            !options.enableHighlightByMyAnswers;

        if (isDisabled) {
            return;
        }

        var answers = getAnswers(options);
        sortAnswers(answers);

        if (options.enableHighlightByMyAnswers) {

            // workaround;
            options.enableSortByMyAnswers = true;
            answers = getAnswers(options);
            // end of workaround

            markAnswersAsUpVoted(answers.my);
        }

        // scroll back to ancor element
        var hash = window.location.hash && window.location.hash.substring(1);
        if (hash) {
            var ancorElement = document.getElementById('answer-' + hash);
            if (ancorElement) {

                setTimeout(function () {
                    jQuery('html, body').animate({
                        scrollTop: jQuery(ancorElement).offset().top
                    }, 0);
                }, 300);
            }
        }
    });


    function calculateAnswerPriorities(answers) {
        var answerPriorities = {};

        var sortedAnswers = [
            answers.my,
            answers.upVoted,
            answers.neutral,
            answers.downVoted
        ];

        var position = 0;

        sortedAnswers.forEach(function (subAnswers) {
            subAnswers.forEach(function (answer) {
                var answerId = jQuery(answer).attr('id');
                answerPriorities[answerId] = position++;
            });
        });

        return answerPriorities;
    }

    function sortAnswers(answers) {

        var answerPriorities = calculateAnswerPriorities(answers);
        var allAnswers = answers.all.slice();

        // Bubble sorting the answers
        var swapped = true;
        var lastUnsortedIndex = allAnswers.length;
        while (swapped) {
            var swapped = false;
            for (var i = 0; i < lastUnsortedIndex - 1; i++) {

                var leftAnswer = allAnswers[i];
                var leftAnswerId = jQuery(leftAnswer).attr('id');

                var rightAnswer = allAnswers[i + 1];
                var rightAnswerId = jQuery(rightAnswer).attr('id');


                if (answerPriorities[leftAnswerId] > answerPriorities[rightAnswerId]) {
                    allAnswers[i] = rightAnswer;
                    allAnswers[i + 1] = leftAnswer;
                    swapElements(leftAnswer, rightAnswer);
                    swapped = true;
                }
            }

            lastUnsortedIndex -= 1;
        }

    }

    function swapElements(first, second) {
        if (first == second || !first || !second) {
            return;
        }

        first = jQuery(first);
        second = jQuery(second);
        var temp = jQuery('<span>').hide();
        first.before(temp);
        second.before(first);
        temp.replaceWith(second);
    };

    function getAnswers(options) {
        var my = [];
        var upVoted = [];
        var neutral = [];
        var downVoted = [];
        var all = jQuery('.answer:not(.deleted-answer)').toArray();

        var loggedUserProfileLink = jQuery('.my-profile,.profile-me').slice(0, 1).attr('href');

        all.forEach(function (answer, position) {
            answer = jQuery(answer);

            var answerUserProfileLink = answer.find('.user-details > a').last().attr('href');

            // Up vote
            if (options.enableSortByMyUpvotes && answer.find('.js-vote-up-btn.fc-theme-primary').length) {
                upVoted.push(answer);
            }

            // Down vote
            else if (options.enableSortByMyUpvotes && answer.find('.js-vote-down-btn.fc-theme-primary').length) {
                downVoted.push(answer);
            }

            // Current logged in user's answer
            else if (options.enableSortByMyAnswers && answerUserProfileLink && loggedUserProfileLink == answerUserProfileLink) {
                my.push(answer);
            }
            // Neutral - did not vote
            else {
                neutral.push(answer);
            }

        });

        return {
            my: my,
            upVoted: upVoted,
            neutral: neutral,
            downVoted: downVoted,
            all: all
        };
    }

    function markAnswersAsUpVoted(answers) {
        answers.forEach(function (answer) {
            answer = jQuery(answer);
            answer.find('.js-vote-up-btn').addClass('fc-theme-primary');
        });
    }


});
