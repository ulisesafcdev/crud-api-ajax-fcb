import ajax from './ajax.js';

const $tableData = document.querySelector('.table-data');
const $crudForm = document.querySelector('.crud-form');
const $titleForm = document.querySelector('.crud-title');
const $template = document.getElementById('template-table').content;
const $fragment = document.createDocumentFragment();
/* 
    --> esta funcion nos devuelve los datos de la api 
    --> recorremos esos datos para poder mostrarlo en la tabla de datos
    --> Hacemos uso de template, fragment, para mostrar esos datos en la tabla dinamicamente
    */
const getDataGoalkeepers = () => {
    ajax({
        method: 'GET',
        url: 'http://localhost:3000/goalkeepers',
        success: (data) => {
            data.forEach(el => {
                $template.querySelector('.id').textContent = el.id;
                $template.querySelector('.name').textContent = el.name;
                $template.querySelector('.country').textContent = el.country;
                $template.querySelector('.dorsal').textContent = el.dorsal;
                $template.querySelector('.btnEdit').dataset.id = el.id;
                $template.querySelector('.btnEdit').dataset.name = el.name;
                $template.querySelector('.btnEdit').dataset.country = el.country;
                $template.querySelector('.btnEdit').dataset.dorsal = el.dorsal;
                $template.querySelector('.btnDelete').dataset.id = el.id;
                let $clone = document.importNode($template, true);
                $fragment.appendChild($clone);
            })
            $tableData.querySelector('tbody').appendChild($fragment);
        },
        error: (error) => {
            let notify = `
                <div class="alert alert-danger" role="alert">
                    ${error}
                </div>
            `;
            $tableData.insertAdjacentHTML('afterend', notify);
        },
        data: null
    })
}
/* --> al cargar la pagina, se carga la funcion que nos devuelve los datos de la api */
document.addEventListener('DOMContentLoaded', getDataGoalkeepers);
/* 
    --> Al formulario, al hacer submit, evaluamos si en el formulario hay un id en el input oculto que asignamos
        Si no lo hay, lo que haremos es crear un nuevo registro a la api
        Si lo hay, lo que haremos es actualizar los datos
    */
document.addEventListener('submit', (e) => {
    if (e.target === $crudForm) {
        e.preventDefault();
        if (!e.target.id.value) {
            /* --->  CREATE  <--- */
            ajax({
                method: 'POST',
                url: 'http://localhost:3000/goalkeepers',
                success: (data) => {
                    location.reload();
                },
                error: (error) => {
                    let notify = `
                        <div class="alert alert-danger" role="alert">
                            ${error} - No se pudo guardar el registro...
                        </div>
                    `;
                    $tableData.insertAdjacentHTML('beforebegin', notify);
                },
                data: {
                    name: e.target.name.value,
                    country: e.target.country.value,
                    dorsal: e.target.dorsal.value
                }
            })
        } else {
            /* --->  UPDATE  <--- */
            ajax({
                method: 'PUT',
                url: `http://localhost:3000/goalkeepers/${e.target.id.value}`,
                success: (data) => {
                    location.reload();
                },
                error: (error) => {
                    let notify = `
                        <div class="alert alert-danger" role="alert">
                            ${error} - No se pudieron actualizar los datos...
                        </div>
                    `;
                    $tableData.insertAdjacentHTML('beforebegin', notify);
                },
                data: {
                    name: e.target.name.value,
                    country: e.target.country.value,
                    dorsal: e.target.dorsal.value
                }
            })
        }
    }
})
/* 
    --> Al hacer click en uno de los botones de eliminar o actualizar
    */
document.addEventListener('click', (e) => {
    /* ---> Al dar click al boton de actualizar <--- */
    if (e.target.matches('.btnEdit')){
        /* --> se mostraran los datos en el formulario <-- */
        $titleForm.textContent = 'Actualizar Datos';
        $crudForm.name.value = e.target.dataset.name;
        $crudForm.country.value = e.target.dataset.country;
        $crudForm.dorsal.value = e.target.dataset.dorsal;
        $crudForm.id.value = e.target.dataset.id;
    }
    /* ---> Al dar click al boton de eliminar <--- */
    if (e.target.matches('.btnDelete')) {
        /* ---> se hara el proceso de eliminar <--- */
        let conf = confirm('¿Esta seguro que desea eliminar el registro?');
        if (conf) {
            ajax({
                url: `http://localhost:3000/goalkeepers/${e.target.dataset.id}`,
                method: 'DELETE',
                success: (res) => {
                    location.reload();
                },
                error: (error) => {
                    let notify = `
                        <div class="alert alert-danger" role="alert">
                            ${error} - Hubo un error al eliminar el registro...
                        </div>
                    `;
                    $tableData.insertAdjacentHTML('beforebegin', notify);
                }
            })
        }
    }
})