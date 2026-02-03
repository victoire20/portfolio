import { useTranslation } from "react-i18next"
import { Icons } from "../../icons"

import './QuotationSection.css'

export default function QuotationSection() {
    const { t } = useTranslation()

    return (
        <div className="quotation small-square-right">
            <div className="quotation__content">
                <img src={Icons.quote} alt="quote image" />
                {t('quotation.content')}
            </div>
            <div className="quotation__author">
                <img src={Icons.quote} alt="quote image" />
                - Albert Einstein
            </div>
        </div>
    )
}