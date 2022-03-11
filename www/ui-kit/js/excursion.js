setTimeout(()=>{
    TTS.speak({
        text: 'В целом, конечно, убеждённость некоторых оппонентов способствует подготовке и реализации экспериментов, поражающих по своей масштабности и грандиозности. Противоположная точка зрения подразумевает, что реплицированные с зарубежных источников, современные исследования преданы социально-демократической анафеме. Высокий уровень вовлечения представителей целевой аудитории является четким доказательством простого факта: повышение уровня гражданского сознания требует анализа поставленных обществом задач.',
        locale: 'ru-RU',
        rate: 1
    }, function () {
        console.log('Text succesfully spoken');
    }, function (reason) {
        console.log(reason);
    });
    TTS["stop"] = function(){
        TTS.speak({text: ''});
    };
},500);