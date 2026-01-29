import type { AnchorHTMLAttributes, ReactNode } from 'react'


type ButtonProps = {
    url: string
    children: ReactNode
} & AnchorHTMLAttributes<HTMLAnchorElement>

export default function Button({ url, children, className, ...props }: ButtonProps) {
    return <a
      href={url}
      className={className}
      {...props}
    >
      {children}
    </a>
}