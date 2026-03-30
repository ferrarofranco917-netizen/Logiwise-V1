
const main = document.getElementById('main');

function render(route){
  if(route==='practices'){
    main.innerHTML='<h2>Pratiche</h2>';
  } else {
    main.innerHTML='<h2>Dashboard</h2>';
  }
}

document.addEventListener('click', e=>{
  if(e.target.dataset.route){
    render(e.target.dataset.route);
  }
});

render('dashboard');
