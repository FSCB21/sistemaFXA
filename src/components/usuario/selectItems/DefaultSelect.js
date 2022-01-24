import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';


export const DefaultSelect = (params) => {

    const [itemSeleccionado, setItemSeleccionado] = useState(params.id);
    const [items, setitems] = useState(null);


    useEffect(() => {
        const ItemService  = require(`../../../service/${params.serviceName}`);
        const itemService = new ItemService.default()
        itemService.getAll().then(res=>{
            setitems(res.data)
            })
    }, [params.serviceName]); 
    
    const onChange = (e) => {
        setItemSeleccionado(e.value);
    }

  return (
    <Dropdown className='inputForm' dropdownIcon={null} value={itemSeleccionado} options={items} onChange={onChange} optionLabel={params.nombre_def} optionValue={params.id_def} filter filterBy="nombre_ciudad" placeholder=""
    emptyMessage="No se encontraron resultados" emptyFilterMessage="No se encontraron resultados"/>
  );

};

 
