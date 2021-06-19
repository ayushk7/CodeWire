export const BuilInFunctions = {
    lower_bound: `function lower_bound(_arr, _value){
        let _low = 0, _high = _arr.length - 1;
        while(_low <= _high){
            let _mid = _low + Math.floor((_high - _low) / 2);
            if(_arr[_mid] >= _value)
                _high = _mid - 1;
            else
                _low = _mid + 1;
        }
        return _low;    
    }
    `,
    upper_bound: `function upper_bound(_arr, _value){
        let _low = 0, _high = _arr.length - 1;
        while(_low <= _high){
            let _mid = _low + Math.floor((_high - _low) / 2);
            if(_arr[_mid] <= _value)
                _low = _mid + 1;
            else
                _high = _mid - 1;
        }
        return _low;    
    }
    `,
    binary_search_exist: `function binary_search_exist(_arr, _value){
        let _low = 0, _high = _arr.length - 1;
        while(_low <= _high){
            let _mid = _low + Math.floor((_high - _low) / 2);
            if(_arr[_mid] === _value)
                return true;
            else if(_arr[_mid] < _value)
                _low = _mid + 1;
            else
                _high = _mid - 1;
        }
        return false;    
    }
    `,
    fetch_data: `async function fetch_data(_url){
        const _response = await fetch(_url);
        if(!_response.ok){
            throw new Error();
        }
        const _json = await _response.json();
        return _json;
    }
    `


}