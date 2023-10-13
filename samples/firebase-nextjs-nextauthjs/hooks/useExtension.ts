import { AivExtensionClient } from '@affinidi/client-aiv-extension'
import { useEffect, useState } from 'react'

const client = new AivExtensionClient()

export function useExtension() {
  const [isInitializing, setIsInitializing] = useState(true)
  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false)

  useEffect(() => {
    async function init() {
      setIsExtensionInstalled(await client.isInstalled())
      setIsInitializing(false)
    }

    init()
  }, [])
  
  return {
    client,
    isInitializing,
    isExtensionInstalled,
  }
}