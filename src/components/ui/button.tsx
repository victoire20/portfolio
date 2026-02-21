import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { NavLink } from 'react-router-dom'


type ButtonProps = {
    url: string
    children: ReactNode
} & AnchorHTMLAttributes<HTMLAnchorElement>

export default function Button({ url, children, className, download, ...props }: ButtonProps) {
    return <NavLink
      to={url}
      className={className}
      download={download ? true : undefined}
      {...props}
    >
      {children}
    </NavLink>
}