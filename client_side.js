var primary_img_link;
var backup_img_link;
var company_name;

function formatMoney(number, decPlaces, decSep, thouSep) {
    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
    decSep = typeof decSep === "undefined" ? "." : decSep;
    thouSep = typeof thouSep === "undefined" ? "," : thouSep;
    var sign = number < 0 ? "-" : "";
    var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
    var j = (j = i.length) > 3 ? j % 3 : 0;
    
    return sign +
        (j ? i.substr(0, j) + thouSep : "") +
        i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
        (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
    }

function hideResults(){
    $('#results').hide();
}

var body = document.getElementById('body')

body.addEventListener('load',hideResults());

$('#get_stock_information').click(function(){
    let stock = $('#chosen_stock').val();
    console.log(stock);
    const link = "https://flaskstocksapp.herokuapp.com/stocks/"
    let request_link = link + stock 

    $.get(request_link)
    .done (function(data){
    console.log(data);

    $('#my_stock').text(stock);
    $('#final_image').attr("src",primary_img_link);
    $('#company').text(company_name);
    console.log(primary_img_link)
    //$('final_img').attr("onerror",backup_img_link);
    $('#current_price').text('Current Price: ' + '$' +  formatMoney(data.current_price))
    $('#predicted_price').text('Predicted next price: ' + '$' + formatMoney(data.predicted_price))
    $('#method_used').text('Method used for prediction: ' + data.method_used)
    $('#results').show();


    })
    .fail (function(){
        console.log('error')
        $('#current_price').text('')
        $('#predicted_price').text('')
        $('#method_used').text('')
        $('#current_price').text('Please enter a valid ticker symbol or wait a minute and try again');
        alert('Please enter a valid ticker symbol or wait a minute and try again');
        


    });

});

//var chosen_link = document.getElementById('selected_stock')

//chosen_link.addEventListener('click', function(){
//    console.log()
//});

//Setting up the suggestion box using the alpha vantage API

var input_box = document.getElementById('chosen_stock');

input_box.addEventListener('input', function(){
    hideResults();
    $('#current_price').text('')
    $('#predicted_price').text('')
    $('#method_used').text('')
    $('#current_price').text('')
    var names = []
    var symbols = []
    var logo_links = []
    var i = 0
    var matches = []
    //console.log ($('#chosen_stock').val());

    let search_stock = $('#chosen_stock').val()

    let lookup_link = 'http://d.yimg.com/aq/autoc?region=US&lang=en-US&query=' + search_stock

    $.get(lookup_link)
    .done(function(data){
        //console.log(data.ResultSet.Result);

        for (var item in data.ResultSet.Result){
            //console.log(data.ResultSet.Result[item].symbol);
            let symbol = data.ResultSet.Result[item].symbol;
            let name = data.ResultSet.Result[item].name;
            let logo_string_initial = name.split(' ')[0] + '.com'
            let logo_string = logo_string_initial.replace(',','')
            let logo_search_link = 'https://logo.clearbit.com/' + logo_string

            if (names.includes(name) == false && symbol.includes('.') == false){
                names.push(name)
                matches.push({
                    'name':name,
                    'symbol': symbol,
                    'logo_link': logo_search_link
                })
                //names.push(name);
                //symbols.push(symbol);
                //logo_links.push(logo_search_link);

            }

        };
        

        console.log(matches)

        //console.log(names);
        //console.log(symbols);
        //console.log(logo_links);

        if (matches.length > 0){
            const html = matches.map(match=> `
            <div class = "card card-body mb-1">
            <div class = "row">
            <div class = "col-sm-2">
                <img id = ${match.symbol} class = "card-img" src = ${match.logo_link} alt = "Card image" onerror = 'this.src= "https://cdn0.iconfinder.com/data/icons/marketplace-2/100/Dollar-512.png"'/>
            </div>
            <div class = "col-sm-10">
                <div class = "card-body-right">
                    <h4 id= ${match.symbol}_companyName>${match.name}</h4>
            <span class='text-primary'>
            (${match.symbol})
            <button class="btn btn-outline-primary float-right" id=chosen_stock>Choose Stock
            </span>
            </div>
            </div>
            </div>
            </div>


            
        `).join(' ');

        //console.log(html);

        document.getElementById('match-list').innerHTML = html;

        
        let options = document.getElementsByClassName('btn btn-outline-primary float-right');

        //console.log(options);

        for (var i = 0; i<options.length; i++){
            //console.log(options[i]);
            options[i].addEventListener('click', function(data){
                //console.log(data.toElement.previousSibling);
                console.log(data)
                var stock = String(data.toElement.previousSibling.wholeText);

                var clean_stock = (stock.replace(/[()]/g,'')).trim();

                $('#chosen_stock').val(clean_stock);

                //store the logo link as a variable by looking for id with the stock name

                primary_img_link = document.getElementById(clean_stock).src
                backup_img_link = document.getElementById(clean_stock).onerror
                company_name = document.getElementById(clean_stock+'_companyName').innerHTML;
                console.log(company_name)
                //console.log(primary_img_link);
                //console.log(backup_img_link)
                

                document.getElementById('match-list').innerHTML = ''
                $('#current_price').text('');



                
                

                
                
            })
        }

    } else{

        document.getElementById('match-list').innerHTML = ''

    }
        
        
           
        
    });

});



