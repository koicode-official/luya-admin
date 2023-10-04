import './globals.css'
import ReactQueryProvider from '/utils/ReactQueryProvider'
import RecoilRootProvider from '/utils/RecoilRootProvider'
import StyledComponentsRegistry from '/utils/StyleRegistry';
import CommonLayout from '/component/common/CommonLayout';
import LoadingSpinner from '/component/common/LoadingSpinner';
import { Suspense } from 'react';
import NavigationEvents from '../../utils/NavigationEvent';

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <ReactQueryProvider>
          <RecoilRootProvider>
            <NavigationEvents>
              <Suspense fallback={<LoadingSpinner />}>
                <StyledComponentsRegistry>
                  <CommonLayout>
                    {children}
                  </CommonLayout>
                </StyledComponentsRegistry>
              </Suspense>
            </NavigationEvents>
          </RecoilRootProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
