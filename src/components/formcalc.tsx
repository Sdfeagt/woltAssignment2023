import React, { useEffect, useState } from 'react';
import { Collapse, Container } from 'react-bootstrap';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import moment from 'moment';


import 'bootstrap/dist/css/bootstrap.min.css';

interface FeeInformation {
  value: number,
  dist: number,
  itemnsNo: number,
  dataTime: string
}

const FormCalc = () =>{
  useEffect(()=>{
  })
  const [validated, setValidated] = useState(false);
  const [showResult, setshowResult] = useState(false);
  const [detectChange, setDetectChange] = useState<FeeInformation>()
  const [deliveryInfo, setDeliveryInfo] = useState<FeeInformation>({
    value: 0.0,
    dist: 0,
    itemnsNo: 0,
    dataTime: ''
  })

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault()
    setValidated(true);

    if (deliveryInfo.value > 0.0 && deliveryInfo.dist > 0 && deliveryInfo.itemnsNo > 0){
      setDetectChange(deliveryInfo)
      setshowResult(true)
    }
    else{
      setshowResult(false)
    }
  }


  const CalcFee = (feeinfo: FeeInformation) =>{
    if (showResult && detectChange === deliveryInfo){
    let deliveryFee: number = 0
    if (feeinfo.value < 10){
      deliveryFee += 10-feeinfo.value
    }
    if (feeinfo.dist <= 1000){
      deliveryFee += 2
    }
    else {
      deliveryFee += Math.ceil((feeinfo.dist - 1000)/500)
    }
    if (feeinfo.itemnsNo >= 13){
      deliveryFee += (feeinfo.itemnsNo-4) * 0.5 + 1.2
    }
    else if (feeinfo.itemnsNo >= 5){
      deliveryFee += (feeinfo.itemnsNo-4) * 0.5
    }
    if(getDay(feeinfo.dataTime) && getTime(feeinfo.dataTime)){
      deliveryFee *= 1.2
    }
    if(deliveryFee > 15){
      deliveryFee = 15
    }
    if(feeinfo.value >= 100){
      deliveryFee = 0
    }
    return(<div className='response'>Delivery fee: {Math.round(deliveryFee * 100) / 100}</div>)
  }
  else{
    return(<div className='response'>Input the variables and press `Calculate`</div>)
  }
  }

  const getDay = (dateString: string) =>{
    if (new Date(dateString).getDay() === 5){
      return true
    }
    else{
      return false
    }
  }
  const getTime = (dateString: string) => {
    let hour: number = Number(dateString.slice(11,13))
    if (hour >= 15 && hour <= 19){
      return true
    }
    else{
      return false
    }
  }




  return (
    <Container className='min-vh-100 d-flex flex-column justify-content-center align-items-center'>
    <Form noValidate validated={validated} onSubmit={handleSubmit} className=' mb-3 border border-primary rounded p-3 w-50'>
      <Row className="b-3 d-flex justify-content-center">
        <Form.Group as={Col} md="max-auto" controlId="value">
          <Form.Label>Cart value</Form.Label>
          <Form.Control required type="number" min={0} placeholder="€" onChange={(event) =>  setDeliveryInfo({ ...deliveryInfo, value: Number(event.target.value) })}
          />
        <Form.Control.Feedback type="invalid" >Please provide a valid value.</Form.Control.Feedback>
        <Form.Control.Feedback>Cart value saved!</Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3 d-flex justify-content-center">
        <Form.Group as={Col} md="max-auto" controlId="dist">
          <Form.Label>Delivery distance</Form.Label>
          <Form.Control required type="number" step={1} min = {0} placeholder="m" onChange={(event) => setDeliveryInfo({ ...deliveryInfo, dist: Number(event.target.value) })} />
          <Form.Control.Feedback type="invalid">Please rovide a valid distance.</Form.Control.Feedback>
          <Form.Control.Feedback>Distance saved!</Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3 d-flex justify-content-center">
        <Form.Group as={Col} md="max-auto" controlId="itemsNo">
          <Form.Label>Number of items</Form.Label>
          <Form.Control required type="number" step={1} min = {0} placeholder="0" onChange={(event) => setDeliveryInfo({ ...deliveryInfo, itemnsNo: Number(event.target.value) })} />
          <Form.Control.Feedback type="invalid">Please provide a valid number of items.</Form.Control.Feedback>
          <Form.Control.Feedback>Number of items saved!</Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className='mb-3 d-flex justify-content-center'>
        <Form.Group as = {Col} md="max-auto" controlId="dateTime">
        <Form.Label>Date of the order</Form.Label>
        <Form.Control required type="datetime-local" placeholder={moment().format().slice(0,16)} defaultValue={moment().format().slice(0,16)} onChange={(event) => setDeliveryInfo({ ...deliveryInfo, dataTime: event.target.value })} />
        </Form.Group>
      </Row>
      <div  className='mb-3 d-flex justify-content-center'>
      <Button size='lg' type="submit">Calculate</Button>
      </div>
    </Form>
    <Row className='p-3'>
    <CalcFee {...deliveryInfo}/>
    </Row>
    </Container>
  );
}

export default FormCalc