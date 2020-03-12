define(['qlik', 'jquery', 'css!./style.css'
],
    function (qlik, $, layout) {

        var el = document.createElement('div');
        var domString = '<div id="countdown"><div id="tiles" class="color-full"></div><div class="countdown-label">Bis zum Rennen!</div></div>';
        el.innerHTML = domString;
        document.body.appendChild(el);
        el.setAttribute("style", "visibility:hidden");

        // creating the HTML objects which will be appended in the print
        //info output
        var info = document.createElement("h2");
        //give it an unique id
        info.setAttribute("id", "info");
        info.setAttribute("style", "visibility:hidden");
        var infoText = document.createTextNode("");

        //button to start
        var button = document.createElement("button");
        //give it an unique id
        button.setAttribute("id", "button");
        button.setAttribute("style", "visibility:visible");
        var buttonText = document.createTextNode("Start!");
        button.appendChild(buttonText);
        // end creating the HTML

        'use strict';
        return {
            // properties field for gettin the data from qlik
            definition: {
                type: "items",
                component: "accordion",
                items: {

                    appearancePanel: {
                        uses: "settings",
                        items: {
                            MyStringProp: {
                                ref: "timeString1",
                                type: "string",
                                label: "Trigger Uhrzeit",
                                defaultValue: "10:00"

                            },
                            Start: {
                                ref: "timeString2",
                                type: "string",
                                label: "Counter Minuten",
                                defaultValue: "10"
                            }
                        }
                    }
                }
            },
            // end properties field

            // paint function to render the html elements
            paint: function ($element, layout) {

                $element.empty();
                $element.append(el);
                $element.append(button);
                $element.append(info);



                // creating variables for the data from qlik, first for the trigger and latter for the seconds
                var infoTrigger = layout.timeString1;
                var infoMinutes = layout.timeString2;
                var outMinutes;

                if (infoMinutes === "1") {
                    outMinutes = "Minute";
                } else {
                    outMinutes = "Minuten";
                }


                // setting the info field with the data we get from qlik
                document.getElementById("info").innerHTML = "Der Trigger ist um " + infoTrigger + " Uhr! Countdown gesetzt für " + infoMinutes + " " + outMinutes + "!";

                // creating a Flag, which we later set to true, to activate the second setInterval function, which is the function for the seconds
                var counterFlag;
                var timerFlag;
                // first variable is the trigger as string, the seconds variable are the seconds which we cast to a number
                var vQlik = layout.timeString1;
                var vQlikSek = Number(layout.timeString2);

                // here we define the counter data
                var today = new Date();
                var year = today.getFullYear();
                var month = today.getMonth();
                var day = today.getDate();
                // hour and minute we set from the trigger input
                var second = today.getSeconds();
                var millisecond = today.getMilliseconds();

                // we make a specific date, the hours and minutes we get from the user input, which we split then
                var today = new Date(year, month, day, vQlik.split(":")[0], vQlik.split(":")[1], second, millisecond);


                //gives the time what the user has been given to us in milliseconds
                var todayMsec = today.getTime();

                //gives the current miliseconds for now
                var nun = Date.now();
                //we calculate the difference between our date and now
                var diff = todayMsec - nun;

                // the milliseconds converted in seconds (diff are the milliseconds which we have as different from now)
                var seconds = diff / 1000;


                //when clicking the button the startCounter function starts, which is the main logic of the extension
                document.querySelector("#button").addEventListener("click", startCounter);


                function myTimerDisplay() {
                    var minutes = infoMinutes;

                    var target_date = new Date().getTime() + ((minutes * 60) * 1000); // set the countdown date
                    var time_limit = ((minutes * 60) * 1000);
                    //set actual timer
                    setTimeout(
                        function () {

                            qlik.navigation.nextSheet();
                        }, time_limit);

                    var days, hours, minutes, seconds; // variables for time units

                    var countdown = document.getElementById("tiles"); // get tag element

                    getCountdown();

                    var secInterval = setInterval(function () { getCountdown(); }, 1000);

                    function getCountdown() {

                        // find the amount of "seconds" between now and target
                        var current_date = new Date().getTime();
                        var seconds_left = (target_date - current_date) / 1000;

                        if (seconds_left > 0) {
                            console.log(time_limit);
                            seconds_left--;
                            if ((seconds_left * 1000) < (time_limit / 2)) {
                                $('#tiles').removeClass('color-full');
                                $('#tiles').addClass('color-half');

                            }
                            if ((seconds_left * 1000) < (time_limit / 4)) {
                                $('#tiles').removeClass('color-half');
                                $('#tiles').addClass('color-empty');
                            }

                            days = pad(parseInt(seconds_left / 86400));
                            seconds_left = seconds_left % 86400;

                            hours = pad(parseInt(seconds_left / 3600));
                            seconds_left = seconds_left % 3600;

                            minutes = pad(parseInt(seconds_left / 60));
                            seconds = pad(parseInt(seconds_left % 60));

                            // format countdown string + set tag value
                            countdown.innerHTML = "<span>" + hours + ":</span><span>" + minutes + ":</span><span>" + seconds + "</span>";



                        }





                    }

                    function pad(n) {
                        return (n < 10 ? '0' : '') + n;
                    }
                }



                function startCounter() {

                    //console.log(el);

                    // when pressing the button we want to hide the button itself and make the info field visible
                    document.getElementById("button").style.visibility = "hidden";
                    document.getElementById("info").style.visibility = "visible";


                    // we create a setInterval for counting down the seconds for the trigger
                    var interval = setInterval(drawTime, 1000);
                    function drawTime() {
                        if (seconds > 0) {
                            seconds--;

                            console.log(seconds);


                        } else if (seconds === 0) {
                            clearInterval(interval);
                            // after reaching 0 we clear the interval	
                            document.getElementById("info").style.visibility = "hidden";
                            document.getElementById("countdown").style.visibility = "visible";
                            myTimerDisplay();


                        }
                    }


                }



            }
        };
    });