import React from 'react';

const RefButton = ({refSearch,handleRefButtonClick}) =>{
    
 return(
     <div>
         <button onClick={handleRefButtonClick}>{refSearch}</button>
     </div>
 )   
}

export default RefButton;