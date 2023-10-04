import './globals.css'
import ReactQueryProvider from '/utils/ReactQueryProvider'
import RecoilRootProvider from '/utils/RecoilRootProvider'
import StyledComponentsRegistry from '/utils/StyleRegistry';
import CommonLayout from '../../../component/common/CommonLayout';
import LoadingSpinner from '../../../component/common/LoadingSpinner';
import { Suspense } from 'react';

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <ReactQueryProvider>
          <RecoilRootProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <StyledComponentsRegistry>
                <CommonLayout>
                  {children}
                </CommonLayout>
              </StyledComponentsRegistry>
            </Suspense>
          </RecoilRootProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
