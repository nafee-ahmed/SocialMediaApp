import React, { useState } from 'react'

function useInputState(initial) {
    const [state, setState] = useState(initial);
    function handleChange(e){
        setState(e.target.value);
    }
    function reset(){
        setState('');
    }
    return [state, handleChange, reset];
}

export default useInputState