import React, { useState } from "react"
import { Container, Button, Col, Form, Row, Badge } from "react-bootstrap"
import moment from "moment"
import "bootstrap/dist/css/bootstrap.min.css"

interface FeeInformation {
  value: number
  dist: number
  itemnsNo: number
  dataTime: string
}

const FormCalc = () => {
  const [validated, setValidated] = useState(false)
  const [deliveryfee, setDeliveryfee] = useState(0)
  const [deliveryInfo, setDeliveryInfo] = useState<FeeInformation>({
    value: 0.0,
    dist: 0,
    itemnsNo: 0,
    dataTime: "",
  })

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault()
    setValidated(true)

    if (
      deliveryInfo.value > 0.0 &&
      deliveryInfo.dist > 0 &&
      deliveryInfo.itemnsNo > 0 &&
      deliveryInfo.value.toString().length <= 5 &&
      Number.isInteger(deliveryInfo.dist) &&
      Number.isInteger(deliveryInfo.itemnsNo)
    ) {
      calcFee(deliveryInfo)
    } else {
      setDeliveryfee(0)
    }
  }

  const calcFee = (delInfo: FeeInformation) => {
    let fee: number = 0
    if (delInfo.value < 10) {
      fee += 10 - delInfo.value
    }
    if (delInfo.dist <= 1000) {
      fee += 2
    } else {
      fee += Math.ceil((delInfo.dist - 1000) / 500)
    }
    if (delInfo.itemnsNo >= 13) {
      fee += (delInfo.itemnsNo - 4) * 0.5 + 1.2
    } else if (delInfo.itemnsNo >= 5) {
      fee += (delInfo.itemnsNo - 4) * 0.5
    }
    if (
      new Date(delInfo.dataTime).getDay() === 5 &&
      isPeakHour(delInfo.dataTime)
    ) {
      fee *= 1.2
    }
    if (fee > 15) {
      fee = 15
    }
    if (delInfo.value >= 100) {
      fee = 0
    }
    setDeliveryfee(fee)
  }

  const isPeakHour = (dateString: string) => {
    let hour: number = Number(dateString.slice(11, 13))
    if (hour >= 15 && hour <= 19) {
      return true
    } else {
      return false
    }
  }

  return (
    <Container className="min-vh-100 d-flex flex-column justify-content-center align-items-center ">
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        className=" mb-3 border border-primary rounded p-3 w-50">
        <Row className="mb-3 d-flex justify-content-center">
          <Form.Group as={Col} md="max-auto" controlId="value">
            <Form.Label>Cart value</Form.Label>
            <Form.Control
              required
              type="number"
              step={0.01}
              min={0.01}
              placeholder="€"
              onChange={(event) =>
                setDeliveryInfo({
                  ...deliveryInfo,
                  value: Number(event.target.value),
                })
              }
            />
            {deliveryInfo.value <= 0.0 ? (
              <Form.Control.Feedback type="invalid">
                Please provide a value larger than 0!
              </Form.Control.Feedback>
            ) : (
              <Form.Control.Feedback type="invalid">
                Please provide the value in proper format (up to two decimals)!
              </Form.Control.Feedback>
            )}
            <Form.Control.Feedback>Cart value saved!</Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3 d-flex justify-content-center">
          <Form.Group as={Col} md="max-auto" controlId="dist">
            <Form.Label>Delivery distance</Form.Label>
            <Form.Control
              required
              type="number"
              step={1}
              min={0}
              placeholder="m"
              onChange={(event) =>
                setDeliveryInfo({
                  ...deliveryInfo,
                  dist: Number(event.target.value),
                })
              }
            />
            {deliveryInfo.dist <= 0 ? (
              <Form.Control.Feedback type="invalid">
                Please provide a distance larger than 0!
              </Form.Control.Feedback>
            ) : (
              <Form.Control.Feedback type="invalid">
                Please provide the distance in proper format (integers)!
              </Form.Control.Feedback>
            )}
            <Form.Control.Feedback>Distance saved!</Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3 d-flex justify-content-center">
          <Form.Group as={Col} md="max-auto" controlId="itemsNo">
            <Form.Label>Number of items</Form.Label>
            <Form.Control
              required
              type="number"
              step={1}
              min={0}
              placeholder="0"
              onChange={(event) =>
                setDeliveryInfo({
                  ...deliveryInfo,
                  itemnsNo: Number(event.target.value),
                })
              }
            />
            {deliveryInfo.itemnsNo <= 0 ? (
              <Form.Control.Feedback type="invalid">
                Please provide an amount of items larger than 0!
              </Form.Control.Feedback>
            ) : (
              <Form.Control.Feedback type="invalid">
                Please provide the amount of items in proper format(integers)!
              </Form.Control.Feedback>
            )}
            <Form.Control.Feedback>
              Number of items saved!
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3 d-flex justify-content-center">
          <Form.Group as={Col} md="max-auto" controlId="dateTime">
            <Form.Label>Date of the order</Form.Label>
            <Form.Control
              required
              type="datetime-local"
              placeholder={moment().format().slice(0, 16)}
              defaultValue={moment().format().slice(0, 16)}
              onChange={(event) =>
                setDeliveryInfo({
                  ...deliveryInfo,
                  dataTime: event.target.value,
                })
              }
            />
          </Form.Group>
        </Row>
        <div className="mb-3 d-flex justify-content-center">
          <Button size="lg" type="submit">
            Calculate
          </Button>
        </div>
      </Form>
      <Row className="p-3">
        {deliveryfee !== 0 ? (
          <h2>
            <Badge bg="primary">Delivery fee: {deliveryfee}</Badge>
          </h2>
        ) : (
          <h2>
            <Badge bg="secondary">
              Input the variables and press `Calculate`
            </Badge>
          </h2>
        )}
      </Row>
    </Container>
  )
}

export default FormCalc
