REM Delete players and copy over player 0Ujzu57VXWwJTB5erTUp
rmdir /s /q src\pages\games\athos
rmdir /s /q src\pages\games\porthos
rmdir /s /q src\pages\games\gameMaster
Xcopy /E /I src\pages\games\aramis src\pages\games\athos
Xcopy /E /I src\pages\games\aramis src\pages\games\porthos
Xcopy /E /I src\pages\games\aramis src\pages\games\gameMaster