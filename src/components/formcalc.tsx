import React, { useState } from 'react';
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
  const [validated, setValidated] = useState(false);

  const [deliveryInfo, setDeliveryInfo] = useState({
    value: 0.0,
    dist: 0,
    itemnsNo: 0,
    dataTime: ''
  })


  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLInputElement;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setDeliveryInfo({
      value: 0.0,
      dist: 0,
      itemnsNo: 0,
      dataTime: ''
    })
    setValidated(true);
  };

  const calcFee = (feeinfo: FeeInformation) =>{
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
    //Here implement the friday rush
    if(deliveryFee > 15){
      deliveryFee = 15
    }
    if(feeinfo.value >= 100){
      deliveryFee = 0
    }
  }

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit} className='mb-3'>
      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="value">
          <Form.Label>Cart value</Form.Label>
          <Form.Control required type="number" min={0} placeholder="0" defaultValue={0} onChange={(event) => setDeliveryInfo({ ...deliveryInfo, value: Number(event.target.value) })}
          />
        <Form.Control.Feedback type="invalid">Please provide a valid value.</Form.Control.Feedback>
        <Form.Control.Feedback>Cart value saved!</Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="dist">
          <Form.Label>Delivery distance</Form.Label>
          <Form.Control required type="number" step={1} min = {0} placeholder="0" defaultValue={0} onChange={(event) => setDeliveryInfo({ ...deliveryInfo, dist: Number(event.target.value) })} />
          <Form.Control.Feedback type="invalid">Please provide a valid distance.</Form.Control.Feedback>
          <Form.Control.Feedback>Distance saved!</Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="itemsNo">
          <Form.Label>Number of items</Form.Label>
          <Form.Control required type="number" step={1} min = {0} placeholder="0" defaultValue={0} onChange={(event) => setDeliveryInfo({ ...deliveryInfo, itemnsNo: Number(event.target.value) })} />
          <Form.Control.Feedback type="invalid">Please provide a valid number of items.</Form.Control.Feedback>
          <Form.Control.Feedback>Number of items saved!</Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className='mb-3'>
        <Form.Group as = {Col} md="4" controlId="dateTime">
        <Form.Label>Date of the order</Form.Label>
        <Form.Control required type="datetime-local" placeholder={moment().format().slice(0,16)} defaultValue={moment().format().slice(0,16)} onChange={(event) => setDeliveryInfo({ ...deliveryInfo, dataTime: event.target.value })} />
        </Form.Group>
      </Row>
      <Button type="submit">Calculate delivery price</Button>
    </Form>
  );
}

export default FormCalc