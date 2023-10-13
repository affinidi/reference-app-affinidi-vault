import { nanoid } from 'nanoid'

function generateCouponCode() {
  return nanoid(9)
}

export default generateCouponCode