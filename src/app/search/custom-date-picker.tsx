import React, { forwardRef } from 'react'
import DatePicker from "react-datepicker";
import "./react-datepicker.css";


const years= [...Array(11)].map((_, i) => ((new Date()).getFullYear()) - i * 1);
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",];

function CustomDatePicker(props: any) {
    const getYear =(date: Date): number => {
        return date.getFullYear();
    }    
    const getMonth =(date: Date): number => {
        return date.getMonth();
    } 

    const DatePickerInput = forwardRef((props: any, ref) => (
        <button className="btn btn-sm btn-outline-dark" style={{backgroundColor: '#DADADA', width: '110px'}} onClick={props.onClick}> {props.value}</button>
        /*<div style={{textAlign: 'left'}}> 
        <label>{props.caption}</label>
        <input type="text" className="form-control" value={props.value} onClick={props.onClick} readOnly></input>    
        </div>*/
    ));    


  const {value, onDateChange} = props;
  return (<div>
    
    <DatePicker renderCustomHeader={({date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled,}) => (
        <div style={{margin: 10, display: "flex", justifyContent: "center",}}>
            <button className="btn btn-outline-primary btn-sm" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}><i className="bi bi-caret-left"></i></button>
            &nbsp;
            <select className="form-select form-select-sm" style={{width: '78px'}} value={getYear(date)} onChange={({ target: { value } }) => changeYear( parseInt(value) )}>
                {years.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
                ))}
            </select>
            &nbsp;
            <select className="form-select form-select-sm" style={{width: '115px'}} value={months[getMonth(date)]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}>
                {months.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
                ))}
            </select>
            &nbsp;
            <button className="btn btn-outline-primary btn-sm" onClick={increaseMonth} disabled={nextMonthButtonDisabled}><i className="bi bi-caret-right"></i></button>
        </div>
      )}
      locale="en"
      dateFormat="dd-MM-yyyy"
      customInput={<DatePickerInput caption="จากวันที่" />}
      selected={value}
      onChange={(date) => onDateChange(date)}
    />

  </div>)
}

export default CustomDatePicker;