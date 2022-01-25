let modalQ = 1;
let carr = [];
let modalKey = 0;

const p = (el) => document.querySelector(el);
const pz = (el) => document.querySelectorAll(el);


//Eventos das Pizzas

pizzaJson.map((item, index) =>{
    let pizzaItem = p('.models .pizza-item').cloneNode(true);
    
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQ = 1;
        modalKey = key;

        p('.pizzaBig img').src = pizzaJson[key].img;
        p('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        p('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        p('.pizzaInfo--actualPrice').innerHTML = `R$ ${item.price.toFixed(2)}`
        p('.pizzaInfo--size.selected').classList.remove('selected');
        pz('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        })

        p('.pizzaInfo--qt').innerHTML = modalQ;

        p('.pizzaWindowArea').style.opacity = 0;
        p('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            p('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    p('.pizza-area').append(pizzaItem);
});




//Eventos do Modal

function closeModal() {
    p('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=> {
        p('.pizzaWindowArea').style.display = 'none';
    }, 500);
}
pz('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});
p('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if (modalQ > 1) {
        modalQ--;
        p('.pizzaInfo--qt').innerHTML = modalQ;
    }
    
});
p('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQ++;
    p('.pizzaInfo--qt').innerHTML = modalQ;
});
pz('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        p('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
p('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(p('.pizzaInfo--size.selected').getAttribute('data-key'));

    let iden = pizzaJson[modalKey].id+'@'+size;
    let key = carr.findIndex((item)=>item.iden == iden);

    if (key > -1) {
        carr[key].qq += modalQ;
    } else {
        carr.push({
            iden,
            id:pizzaJson[modalKey].id,
            size,
            qq:modalQ
        });
    }

    
    carrinho();
    closeModal();
});

p('.menu-openner').addEventListener('click', ()=>{
    if (carr.length > 0) {
        p('aside').style.left = '0';
    }
    
});

p('.menu-closer').addEventListener('click', ()=>{
    p('aside').style.left = '100vw';
});

function carrinho() {
    p('.menu-openner span').innerHTML = carr.length;
    if (carr.length > 0) {
        p('aside').classList.add('show');
        p('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in carr) {
            let pizzaItem = pizzaJson.find((item)=>item.id == carr[i].id);
            subtotal += pizzaItem.price * carr[i].qq;
            let carrItem = p('.models .cart--item').cloneNode(true);
            let pizzaSizeName;

            switch (carr[i].size) {
                case 0:
                    pizzaSizeName = 'P'
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            
            carrItem.querySelector('img').src = pizzaItem.img;
            carrItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            carrItem.querySelector('.cart--item--qt').innerHTML = carr[i].qq;
            carrItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if (carr[i].qq > 1) {
                    carr[i].qq--;
                } else {
                    carr.splice(i, 1);
                }
                carrinho();
            });
            carrItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                carr[i].qq++;
                carrinho();
            });

            p('.cart').append(carrItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        p('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        p('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        p('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        p('aside').classList.remove('show');
        p('aside').style.left = '100vw';
    }
};