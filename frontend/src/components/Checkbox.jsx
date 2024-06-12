export default function Checkbox({option,onChange}) {
    return (
        <>
           
            <input type="checkbox" id={option} name={option} value={option} onChange={(e) =>onChange(e.target.checked,e.target.value)}
            className="pb-3 pr-4 pl-2"/>
             <label htmlFor={option} className="pb-3 pr-4 pl-2 red-500">{option}</label>
             <br/>
        </>   
    )
}

