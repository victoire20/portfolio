import { Icons } from "../../icons"

import './QuotationSection.css'

export default function QuotationSection() {
    return (
        <div className="quotation small-square-right">
            <div className="quotation__content">
                <img src={Icons.quote} alt="quote image" />
                Science without religion is lame, religion without science is blind
            </div>
            <div className="quotation__author">
                <img src={Icons.quote} alt="quote image" />
                - Albert Einstein
            </div>
        </div>
    )
}